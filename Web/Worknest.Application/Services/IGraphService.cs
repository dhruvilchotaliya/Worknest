using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Worknest.Application.Services
{
    /// <summary>
    /// Abstracts Microsoft Graph API operations for B2B guest management and app role assignments.
    /// Implementation uses GraphServiceClient with client-credentials (app-only) authentication.
    /// </summary>
    public interface IGraphService
    {
        // ─────────────────────────────────────────────
        //  1. GUEST USER MANAGEMENT
        // ─────────────────────────────────────────────

        /// <summary>
        /// Creates a B2B guest invitation in the tenant.
        /// Graph API: POST /invitations
        /// </summary>
        /// <param name="email">The external user's email address.</param>
        /// <param name="displayName">Display name for the guest user.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Result containing the guest's new ObjectId in the tenant and the invite redeem URL.</returns>
        Task<GuestInvitationResult> InviteGuestUserAsync(string email, string displayName, CancellationToken cancellationToken = default);

        /// <summary>
        /// Checks whether a user with the given email already exists as a guest (or member) in the tenant.
        /// Graph API: GET /users?$filter=mail eq '{email}' or otherMails/any(m:m eq '{email}')
        /// </summary>
        /// <param name="email">Email to search for.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>The existing user's details if found, otherwise null.</returns>
        Task<AzureUserQueryResult?> FindUserByEmailAsync(string email, CancellationToken cancellationToken = default);

        /// <summary>
        /// Deletes a guest user from the tenant directory.
        /// Graph API: DELETE /users/{id}
        /// </summary>
        /// <param name="userId">The guest user's ObjectId in the tenant.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        Task DeleteGuestUserAsync(Guid userId, CancellationToken cancellationToken = default);

        // ─────────────────────────────────────────────
        //  2. APP ROLE MANAGEMENT
        // ─────────────────────────────────────────────

        /// <summary>
        /// Assigns an app role to a user (guest or member).
        /// Graph API: POST /servicePrincipals/{spId}/appRoleAssignedTo
        /// </summary>
        /// <param name="userId">The user's ObjectId in the tenant.</param>
        /// <param name="roleName">The app role value (e.g., "Worknest.User").</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        Task AssignAppRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default);

        /// <summary>
        /// Changes a user's app role by removing the old assignment and creating a new one.
        /// Graph API: DELETE /servicePrincipals/{spId}/appRoleAssignedTo/{assignmentId}
        ///            POST   /servicePrincipals/{spId}/appRoleAssignedTo
        /// </summary>
        /// <param name="userId">The user's ObjectId in the tenant.</param>
        /// <param name="newRoleName">The new app role value to assign (e.g., "Worknest.Developer").</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        Task ChangeAppRoleAsync(Guid userId, string newRoleName, CancellationToken cancellationToken = default);

        /// <summary>
        /// Gets all app role assignments for a specific user in this application.
        /// Graph API: GET /users/{id}/appRoleAssignments
        /// </summary>
        /// <param name="userId">The user's ObjectId in the tenant.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>List of role names currently assigned to this user for this application.</returns>
        Task<IReadOnlyList<string>> GetUserAppRolesAsync(Guid userId, CancellationToken cancellationToken = default);

        // ─────────────────────────────────────────────
        //  3. UTILITY
        // ─────────────────────────────────────────────

        /// <summary>
        /// Revokes all refresh tokens for a user, forcing them to re-authenticate.
        /// Useful after a role change to ensure the user picks up the new role.
        /// Graph API: POST /users/{id}/revokeSignInSessions
        /// </summary>
        /// <param name="userId">The user's ObjectId in the tenant.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        Task RevokeUserSessionsAsync(Guid userId, CancellationToken cancellationToken = default);
    }

    /// <summary>
    /// Result returned after successfully creating a B2B guest invitation.
    /// </summary>
    public class GuestInvitationResult
    {
        /// <summary>
        /// The guest user's new ObjectId within the tenant.
        /// This is different from their ObjectId in their home tenant.
        /// </summary>
        public Guid GuestUserId { get; set; }

        /// <summary>
        /// The URL the user must visit to redeem (accept) the invitation.
        /// Can be embedded in the app's onboarding flow.
        /// </summary>
        public string InviteRedeemUrl { get; set; } = string.Empty;

        /// <summary>
        /// Current invitation status (e.g., "PendingAcceptance").
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// The tenant-scoped identity for the guest (e.g., "user_gmail.com#EXT#@tenant.onmicrosoft.com").
        /// </summary>
        public string? GuestUserPrincipalName { get; set; }
    }

    /// <summary>
    /// Represents the query result when searching for a user in Azure AD/Entra ID.
    /// </summary>
    public class AzureUserQueryResult
    {
        public Guid Id { get; set; }
        public string? UserPrincipalName { get; set; }
        public string? Mail { get; set; }
    }
}
