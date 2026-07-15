using ErrorOr;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Common.Constants;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;
using Worknest.Infrastructure.Mappers;
using Microsoft.Extensions.Logging;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class OnboardUserHandler : IRequestHandler<OnboardUserCommand, ErrorOr<OnboardUserResultDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IContextService _contextService;
        private readonly IGraphService _graphService;
        private readonly ILogger<OnboardUserHandler> _logger;

        public OnboardUserHandler(
            IUnitOfWork unitOfWork,
            IEmployeeRepository employeeRepository,
            IContextService contextService,
            IGraphService graphService,
            ILogger<OnboardUserHandler> logger)
        {
            _unitOfWork = unitOfWork;
            _employeeRepository = employeeRepository;
            _contextService = contextService;
            _graphService = graphService;
            _logger = logger;
        }

        public async Task<ErrorOr<OnboardUserResultDto>> Handle(OnboardUserCommand request, CancellationToken cancellationToken)
        {
            if (!_contextService.IsAuthenticated)
            {
                _logger.LogWarning("Onboarding attempt rejected: User is not authenticated.");
                return Error.Unauthorized("Auth.Unauthorized", "User is not authenticated via the onboarding scheme.");
            }

            var email = _contextService.Email;
            var name = _contextService.Name ?? "Microsoft User";

            if (string.IsNullOrEmpty(email))
            {
                _logger.LogWarning("Onboarding attempt rejected: Email claim not found in user identity.");
                return Error.Validation("Auth.MissingEmailClaim", "Email claim not found in user identity.");
            }

            // 1. Check if employee with same email already exists in DB
            _logger.LogInformation("Starting onboarding process for user {Email}.", email);
            var existingEmployee = await _employeeRepository.GetEmployeeByEmailAsync(email, cancellationToken);
            if (existingEmployee != null)
            {
                _logger.LogInformation("Employee record already exists in DB for email {Email}.", email);
                
                // If they already have an AzureObjectId, they are fully registered/onboarded
                if (existingEmployee.AzureObjectId.HasValue)
                {
                    _logger.LogInformation("Employee {Email} already has AzureObjectId {AzureObjectId}. Onboarding completed.", email, existingEmployee.AzureObjectId);
                    return new OnboardUserResultDto
                    {
                        IsAlreadyRegistered = true,
                        RequiresRedemption = false,
                        Employee = EmployeeMapper.ToDto(existingEmployee)
                    };
                }

                // If they don't have AzureObjectId, they were probably pre-seeded by an admin
                // Check if they are already in the tenant
                _logger.LogInformation("User {Email} was pre-seeded in DB. Checking if they exist in the Azure AD tenant.", email);
                AzureUserQueryResult? existingAzure = null;
                try
                {
                    existingAzure = await _graphService.FindUserByEmailAsync(email, cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while searching for user {Email} in Azure AD.", email);
                }

                if (existingAzure != null)
                {
                    _logger.LogInformation("User {Email} found in Azure AD with ObjectId {AzureId}. Linking local employee profile.", email, existingAzure.Id);
                    existingEmployee.AzureObjectId = existingAzure.Id;
                    existingEmployee.AzureEmail = existingAzure.UserPrincipalName;
                    existingEmployee.IsGuestUser = existingAzure.UserPrincipalName != null && existingAzure.UserPrincipalName.Contains("#EXT#");
                    await _unitOfWork.SaveChangesAsync(cancellationToken);

                    // Ensure they have the app role assigned
                    _logger.LogInformation("Assigning app role {Role} to user {AzureId} in Azure AD.", RoleConstants.User, existingAzure.Id);
                    try
                    {
                        await _graphService.AssignAppRoleAsync(existingAzure.Id, RoleConstants.User, cancellationToken);
                        _logger.LogInformation("Successfully assigned app role {Role} to user {AzureId} in Azure AD.", RoleConstants.User, existingAzure.Id);
                    }
                    catch (Exception ex)
                    {
                        // Ignore conflicts if role is already assigned
                        _logger.LogWarning(ex, "App role assignment warning for user {AzureId}: {Message}", existingAzure.Id, ex.Message);
                    }

                    return new OnboardUserResultDto
                    {
                        IsAlreadyRegistered = true,
                        RequiresRedemption = false,
                        Employee = EmployeeMapper.ToDto(existingEmployee)
                    };
                }
                else
                {
                    // They exist in DB but not in tenant context. Invite them as guest.
                    _logger.LogInformation("User {Email} not found in Azure AD tenant. Inviting guest user.", email);
                    GuestInvitationResult inviteResult;
                    try
                    {
                        inviteResult = await _graphService.InviteGuestUserAsync(email, name, cancellationToken);
                        _logger.LogInformation("Successfully invited guest user {Email}. GuestUserId: {GuestUserId}.", email, inviteResult.GuestUserId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to invite guest user {Email} through Microsoft Graph.", email);
                        return Error.Failure("Graph.InviteFailed", $"Failed to invite guest user: {ex.Message}");
                    }

                    existingEmployee.AzureObjectId = inviteResult.GuestUserId;
                    existingEmployee.AzureEmail = inviteResult.GuestUserPrincipalName;
                    existingEmployee.IsGuestUser = true;
                    await _unitOfWork.SaveChangesAsync(cancellationToken);

                    // Assign role
                    _logger.LogInformation("Assigning app role {Role} to newly invited guest user {GuestUserId} in Azure AD.", RoleConstants.User, inviteResult.GuestUserId);
                    try
                    {
                        await _graphService.AssignAppRoleAsync(inviteResult.GuestUserId, RoleConstants.User, cancellationToken);
                        _logger.LogInformation("Successfully assigned app role {Role} to guest user {GuestUserId} in Azure AD.", RoleConstants.User, inviteResult.GuestUserId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "App role assignment warning for guest user {GuestUserId}: {Message}", inviteResult.GuestUserId, ex.Message);
                    }

                    return new OnboardUserResultDto
                    {
                        IsAlreadyRegistered = false,
                        RequiresRedemption = true,
                        InviteRedeemUrl = inviteResult.InviteRedeemUrl,
                        GuestUserId = inviteResult.GuestUserId
                    };
                }
            }

            // 2. User is not in DB. Check if they exist in the Azure tenant.
            _logger.LogInformation("User {Email} not found in DB. Checking if they exist in Azure AD tenant.", email);
            AzureUserQueryResult? azureUser = null;
            try
            {
                azureUser = await _graphService.FindUserByEmailAsync(email, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while searching for user {Email} in Azure AD.", email);
            }

            bool requiresRedemption = false;
            string? inviteRedeemUrl = null;
            Guid azureUserId = Guid.Empty;
            string? azureEmail = null;
            bool isGuestUser = false;

            if (azureUser == null)
            {
                // Invite them to the tenant
                _logger.LogInformation("User {Email} not found in Azure AD tenant. Inviting guest user.", email);
                try
                {
                    var inviteResult = await _graphService.InviteGuestUserAsync(email, name, cancellationToken);
                    _logger.LogInformation("Successfully invited guest user {Email}. GuestUserId: {GuestUserId}.", email, inviteResult.GuestUserId);
                    
                    azureUserId = inviteResult.GuestUserId;
                    azureEmail = inviteResult.GuestUserPrincipalName;
                    isGuestUser = true;
                    requiresRedemption = true;
                    inviteRedeemUrl = inviteResult.InviteRedeemUrl;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to invite guest user {Email} through Microsoft Graph.", email);
                    return Error.Failure("Graph.InviteFailed", $"Failed to invite guest user: {ex.Message}");
                }
            }
            else
            {
                azureUserId = azureUser.Id;
                azureEmail = azureUser.UserPrincipalName;
                isGuestUser = azureUser.UserPrincipalName != null && azureUser.UserPrincipalName.Contains("#EXT#");
                _logger.LogInformation("User {Email} already exists in Azure AD. AzureUserId: {AzureUserId}, IsGuest: {IsGuest}.", email, azureUserId, isGuestUser);
            }

            // Ensure app role assignment in the tenant
            _logger.LogInformation("Assigning app role {Role} to user {AzureUserId} in Azure AD.", RoleConstants.User, azureUserId);
            try
            {
                await _graphService.AssignAppRoleAsync(azureUserId, RoleConstants.User, cancellationToken);
                _logger.LogInformation("Successfully assigned app role {Role} to user {AzureUserId} in Azure AD.", RoleConstants.User, azureUserId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "App role assignment warning for user {AzureUserId}: {Message}", azureUserId, ex.Message);
            }

            // Create new Employee in DB
            _logger.LogInformation("Creating new Employee record in local DB for email {Email}.", email);
            var employee = new Worknest.Domain.Entities.Employee.Employee
            {
                Id = Guid.NewGuid(),
                Name = name,
                Surname = request.Surname,
                Email = email,
                Position = request.Position,
                TeamId = request.TeamId,
                AzureObjectId = azureUserId,
                AzureEmail = azureEmail,
                IsGuestUser = isGuestUser,
                ExperienceInYears = request.ExperienceInYears,
                PhoneNumber = request.PhoneNumber,
                DateOfBirth = request.DateOfBirth,
                Bio = request.Bio,
                WorkModel = request.WorkModel,
                JoinedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            try
            {
                await _employeeRepository.AddEmployeeAsync(employee, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("Successfully created local Employee record with ID {EmployeeId} for email {Email}.", employee.Id, email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save new Employee record locally for email {Email}.", email);
                return Error.Failure("Database.SaveFailed", $"Failed to save employee profile: {ex.Message}");
            }

            return new OnboardUserResultDto
            {
                IsAlreadyRegistered = false,
                RequiresRedemption = requiresRedemption,
                InviteRedeemUrl = inviteRedeemUrl,
                GuestUserId = azureUserId,
                Employee = EmployeeMapper.ToDto(employee)
            };
        }
    }
}
