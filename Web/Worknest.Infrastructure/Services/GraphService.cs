using Azure.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Common.Constants;
using Worknest.Application.Services;

namespace Worknest.Infrastructure.Services
{
    /// <summary>
    /// Implementation of IGraphService using Microsoft Graph SDK with client-credentials flow.
    /// This service manages B2B guest invitations and app role assignments in Azure AD.
    /// </summary>
    public class GraphService : IGraphService
    {
        private readonly GraphServiceClient _graphClient;
        private readonly GraphSettings _settings;
        private readonly ILogger<GraphService> _logger;

        // Cached service principal ID and app roles — looked up once, reused for all calls.
        private string? _cachedServicePrincipalId;
        private IReadOnlyList<AppRole>? _cachedAppRoles;
        private readonly SemaphoreSlim _cacheLock = new(1, 1);

        public GraphService(IOptions<GraphSettings> settings, ILogger<GraphService> logger)
        {
            _settings = settings.Value;
            _logger = logger;

            var credential = new ClientSecretCredential(
                _settings.TenantId,
                _settings.ClientId,
                _settings.ClientSecret);

            _graphClient = new GraphServiceClient(credential);
        }

        public async Task<GuestInvitationResult> InviteGuestUserAsync(
            string email, string displayName, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Microsoft Graph: Preparing guest user invitation for {Email} ({DisplayName}).", email, displayName);
            try
            {
                // Check if user already exists in the tenant
                var existingUser = await FindUserByEmailAsync(email, cancellationToken);
                if (existingUser != null)
                {
                    throw new InvalidOperationException(
                        $"A user with email '{email}' already exists in the tenant with ObjectId '{existingUser.Id}'.");
                }

                var invitation = new Invitation
                {
                    InvitedUserEmailAddress = email,
                    InvitedUserDisplayName = displayName,
                    InviteRedirectUrl = _settings.InviteRedirectUrl,
                    SendInvitationMessage = _settings.SendInvitationEmail,
                    InvitedUserType = "Guest"
                };

                _logger.LogInformation("Microsoft Graph: Sending guest invitation request to Microsoft Graph for {Email}.", email);
                var result = await _graphClient.Invitations.PostAsync(invitation, cancellationToken: cancellationToken);

                if (result?.InvitedUser?.Id == null)
                {
                    throw new InvalidOperationException("Graph API returned an invitation without an invited user ID.");
                }

                _logger.LogInformation("Microsoft Graph: Successfully sent invitation to {Email}. Created UserId: {GuestUserId}.", email, result.InvitedUser.Id);

                return new GuestInvitationResult
                {
                    GuestUserId = Guid.Parse(result.InvitedUser.Id),
                    InviteRedeemUrl = result.InviteRedeemUrl ?? string.Empty,
                    Status = result.Status ?? "Unknown",
                    GuestUserPrincipalName = result.InvitedUser.UserPrincipalName
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Microsoft Graph: Error occurred during guest invitation for {Email}.", email);
                throw;
            }
        }

        public async Task<AzureUserQueryResult?> FindUserByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Microsoft Graph: Searching for user with email '{Email}' in tenant.", email);
            try
            {
                var users = await _graphClient.Users.GetAsync(config => 
                {
                    config.QueryParameters.Filter = $"mail eq '{EscapeODataValue(email)}' or userPrincipalName eq '{EscapeODataValue(email)}'";
                    config.QueryParameters.Select = new[] { "id", "mail", "userPrincipalName", "userType" };
                    config.QueryParameters.Top = 1;
                }, cancellationToken: cancellationToken);

                var user = users?.Value?.FirstOrDefault();
                if (user?.Id != null && Guid.TryParse(user.Id, out var userId))
                {
                    _logger.LogInformation("Microsoft Graph: User found for '{Email}' with ID: {UserId}.", email, userId);
                    return new AzureUserQueryResult
                    {
                        Id = userId,
                        UserPrincipalName = user.UserPrincipalName,
                        Mail = user.Mail
                    };
                }

                _logger.LogInformation("Microsoft Graph: No user found for '{Email}'.", email);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Microsoft Graph: Error occurred while searching for user '{Email}'.", email);
                throw;
            }
        }

        public async Task DeleteGuestUserAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Microsoft Graph: Deleting guest user {UserId}.", userId);
            try
            {
                await _graphClient.Users[userId.ToString()].DeleteAsync(cancellationToken: cancellationToken);
                _logger.LogInformation("Microsoft Graph: Successfully deleted guest user {UserId}.", userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Microsoft Graph: Failed to delete guest user {UserId}.", userId);
                throw;
            }
        }

        public async Task AssignAppRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Microsoft Graph: Preparing to assign app role '{RoleName}' to user {UserId}.", roleName, userId);
            try
            {
                var (servicePrincipalId, appRoleId) = await ResolveRoleAsync(roleName, cancellationToken);

                var assignment = new AppRoleAssignment
                {
                    PrincipalId = userId,
                    ResourceId = Guid.Parse(servicePrincipalId),
                    AppRoleId = appRoleId
                };

                _logger.LogInformation("Microsoft Graph: Assigning role {RoleName} (AppRoleId: {AppRoleId}) on Resource {ServicePrincipalId} to user {UserId}.", roleName, appRoleId, servicePrincipalId, userId);
                await _graphClient
                    .ServicePrincipals[servicePrincipalId]
                    .AppRoleAssignedTo
                    .PostAsync(assignment, cancellationToken: cancellationToken);
                
                _logger.LogInformation("Microsoft Graph: Successfully assigned app role '{RoleName}' to user {UserId}.", roleName, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Microsoft Graph: Error assigning app role '{RoleName}' to user {UserId}.", roleName, userId);
                throw;
            }
        }

        public async Task ChangeAppRoleAsync(Guid userId, string newRoleName, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Microsoft Graph: Changing app role for user {UserId} to '{NewRoleName}'.", userId, newRoleName);
            try
            {
                var (servicePrincipalId, newAppRoleId) = await ResolveRoleAsync(newRoleName, cancellationToken);
                var spId = Guid.Parse(servicePrincipalId);

                _logger.LogInformation("Microsoft Graph: Retrieving existing app role assignments for user {UserId} and resource {ServicePrincipalId}.", userId, servicePrincipalId);
                var assignments = await _graphClient
                    .Users[userId.ToString()]
                    .AppRoleAssignments
                    .GetAsync(config =>
                    {
                        config.QueryParameters.Filter = $"resourceId eq {spId}";
                    }, cancellationToken: cancellationToken);

                if (assignments?.Value != null)
                {
                    foreach (var existing in assignments.Value)
                    {
                        if (existing.ResourceId == spId && existing.Id != null)
                        {
                            _logger.LogInformation("Microsoft Graph: Deleting active app role assignment {AssignmentId} for user {UserId}.", existing.Id, userId);
                            await _graphClient
                                .ServicePrincipals[servicePrincipalId]
                                .AppRoleAssignedTo[existing.Id]
                                .DeleteAsync(cancellationToken: cancellationToken);
                        }
                    }
                }

                var newAssignment = new AppRoleAssignment
                {
                    PrincipalId = userId,
                    ResourceId = spId,
                    AppRoleId = newAppRoleId
                };

                _logger.LogInformation("Microsoft Graph: Assigning new role {NewRoleName} (AppRoleId: {AppRoleId}) to user {UserId}.", newRoleName, newAppRoleId, userId);
                await _graphClient
                    .ServicePrincipals[servicePrincipalId]
                    .AppRoleAssignedTo
                    .PostAsync(newAssignment, cancellationToken: cancellationToken);
                
                _logger.LogInformation("Microsoft Graph: Successfully changed app role to '{NewRoleName}' for user {UserId}.", newRoleName, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Microsoft Graph: Error occurred while changing app role to '{NewRoleName}' for user {UserId}.", newRoleName, userId);
                throw;
            }
        }

        public async Task<IReadOnlyList<string>> GetUserAppRolesAsync(
            Guid userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Microsoft Graph: Fetching app roles for user {UserId}.", userId);
            try
            {
                var (servicePrincipalId, _) = await ResolveRoleAsync(null, cancellationToken);
                var spId = Guid.Parse(servicePrincipalId);

                _logger.LogInformation("Microsoft Graph: Getting app role assignments from API for user {UserId}.", userId);
                var assignments = await _graphClient
                    .Users[userId.ToString()]
                    .AppRoleAssignments
                    .GetAsync(cancellationToken: cancellationToken);

                if (assignments?.Value == null)
                {
                    _logger.LogInformation("Microsoft Graph: No app role assignments found for user {UserId}.", userId);
                    return Array.Empty<string>();
                }

                var appRoles = await GetCachedAppRolesAsync(cancellationToken);
                var roleMap = appRoles.ToDictionary(r => r.Id ?? Guid.Empty, r => r.Value ?? string.Empty);

                var activeRoles = assignments.Value
                    .Where(a => a.ResourceId == spId && a.AppRoleId.HasValue)
                    .Select(a => roleMap.TryGetValue(a.AppRoleId!.Value, out var name) ? name : string.Empty)
                    .Where(name => !string.IsNullOrEmpty(name))
                    .ToList()
                    .AsReadOnly();

                _logger.LogInformation("Microsoft Graph: Found {Count} active roles for user {UserId}: {Roles}", activeRoles.Count, userId, string.Join(", ", activeRoles));
                return activeRoles;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Microsoft Graph: Error occurred while fetching app roles for user {UserId}.", userId);
                throw;
            }
        }


        public async Task RevokeUserSessionsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Microsoft Graph: Revoking user sign-in sessions for user {UserId}.", userId);
            try
            {
                await _graphClient.Users[userId.ToString()]
                    .RevokeSignInSessions
                    .PostAsRevokeSignInSessionsPostResponseAsync(cancellationToken: cancellationToken);
                _logger.LogInformation("Microsoft Graph: Successfully initiated sign-in session revocation for user {UserId}.", userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Microsoft Graph: Error occurred while revoking sessions for user {UserId}.", userId);
                throw;
            }
        }

        private async Task<(string ServicePrincipalId, Guid? AppRoleId)> ResolveRoleAsync(
            string? roleName, CancellationToken cancellationToken)
        {
            var spId = await GetCachedServicePrincipalIdAsync(cancellationToken);
            
            if (string.IsNullOrEmpty(roleName))
                return (spId, null);

            var appRoles = await GetCachedAppRolesAsync(cancellationToken);
            var role = appRoles.FirstOrDefault(r =>
                string.Equals(r.Value, roleName, StringComparison.OrdinalIgnoreCase));

            if (role == null)
            {
                throw new InvalidOperationException(
                    $"App role '{roleName}' not found in the service principal's app roles. " +
                    $"Available roles: {string.Join(", ", appRoles.Select(r => r.Value))}");
            }

            return (spId, role.Id);
        }

        private async Task<string> GetCachedServicePrincipalIdAsync(CancellationToken cancellationToken)
        {
            if (_cachedServicePrincipalId != null)
                return _cachedServicePrincipalId;

            await _cacheLock.WaitAsync(cancellationToken);
            try
            {
                if (_cachedServicePrincipalId != null)
                    return _cachedServicePrincipalId;

                var result = await _graphClient.ServicePrincipals.GetAsync(config =>
                {
                    config.QueryParameters.Filter = $"appId eq '{_settings.ClientId}'";
                    config.QueryParameters.Select = new[] { "id", "appRoles" };
                    config.QueryParameters.Top = 1;
                }, cancellationToken: cancellationToken);

                var sp = result?.Value?.FirstOrDefault()
                    ?? throw new InvalidOperationException(
                        $"Service principal not found for appId '{_settings.ClientId}'. " +
                        "Ensure the app registration exists in the tenant and has an enterprise application.");

                _cachedServicePrincipalId = sp.Id
                    ?? throw new InvalidOperationException("Service principal ID is null.");

                _cachedAppRoles = sp.AppRoles?.ToList().AsReadOnly()
                    ?? (IReadOnlyList<AppRole>)Array.Empty<AppRole>();

                return _cachedServicePrincipalId;
            }
            finally
            {
                _cacheLock.Release();
            }
        }

        private async Task<IReadOnlyList<AppRole>> GetCachedAppRolesAsync(CancellationToken cancellationToken)
        {
            if (_cachedAppRoles != null)
                return _cachedAppRoles;

            await GetCachedServicePrincipalIdAsync(cancellationToken);

            return _cachedAppRoles ?? (IReadOnlyList<AppRole>)Array.Empty<AppRole>();
        }

        private static string EscapeODataValue(string value)
            => value.Replace("'", "''");
    }
}
