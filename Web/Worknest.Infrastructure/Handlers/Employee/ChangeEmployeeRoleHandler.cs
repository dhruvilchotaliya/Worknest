using ErrorOr;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Employee.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;
using Microsoft.Extensions.Logging;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class ChangeEmployeeRoleHandler : IRequestHandler<ChangeEmployeeRoleCommand, ErrorOr<Success>>
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IGraphService _graphService;
        private readonly IContextService _contextService;
        private readonly ILogger<ChangeEmployeeRoleHandler> _logger;

        public ChangeEmployeeRoleHandler(
            IEmployeeRepository employeeRepository,
            IGraphService graphService,
            IContextService contextService,
            ILogger<ChangeEmployeeRoleHandler> logger)
        {
            _employeeRepository = employeeRepository;
            _graphService = graphService;
            _contextService = contextService;
            _logger = logger;
        }

        public async Task<ErrorOr<Success>> Handle(ChangeEmployeeRoleCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Processing role change request for Employee ID {EmployeeId} to new role {NewRoleName}.", request.EmployeeId, request.NewRoleName);

            // 1. Get employee from DB
            var employee = await _employeeRepository.GetEmployeeByIdAsync(request.EmployeeId, cancellationToken);
            if (employee == null)
            {
                _logger.LogWarning("Role change failed: Employee with ID {EmployeeId} not found in DB.", request.EmployeeId);
                return Error.NotFound("Employee.NotFound", $"Employee with ID {request.EmployeeId} not found.");
            }

            if (!employee.AzureObjectId.HasValue)
            {
                _logger.LogWarning("Role change failed: Employee {EmployeeId} does not have an associated Azure AD identity in the DB.", request.EmployeeId);
                return Error.Validation("Employee.NoAzureIdentity", "Employee does not have an associated Azure AD identity.");
            }

            var azureObjectId = employee.AzureObjectId.Value;

            // 2. Prevent self-role modification (security best practice)
            if (_contextService.ObjectId.HasValue && _contextService.ObjectId.Value == azureObjectId)
            {
                _logger.LogWarning("Role change failed: User tried to modify their own role (AzureObjectId: {AzureObjectId}).", azureObjectId);
                return Error.Validation("Employee.SelfRoleModification", "You cannot modify your own role.");
            }

            // 3. Change the role via Microsoft Graph API
            _logger.LogInformation("Invoking Graph API to change app role for user {AzureObjectId} to {NewRoleName}.", azureObjectId, request.NewRoleName);
            try
            {
                await _graphService.ChangeAppRoleAsync(azureObjectId, request.NewRoleName, cancellationToken);
                _logger.LogInformation("Successfully updated app role for user {AzureObjectId} to {NewRoleName} in Azure AD.", azureObjectId, request.NewRoleName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update role for user {AzureObjectId} to {NewRoleName} in Azure AD.", azureObjectId, request.NewRoleName);
                return Error.Failure("Graph.RoleChangeFailed", $"Failed to update role in Azure AD: {ex.Message}");
            }

            // 4. Force user sessions to revoke so they are prompted to re-auth and get the new token claims
            _logger.LogInformation("Invoking Graph API to revoke sessions for user {AzureObjectId} to apply new role changes.", azureObjectId);
            try
            {
                await _graphService.RevokeUserSessionsAsync(azureObjectId, cancellationToken);
                _logger.LogInformation("Successfully revoked user sessions for {AzureObjectId}.", azureObjectId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Session revocation warning for user {AzureObjectId}: {Message}", azureObjectId, ex.Message);
            }

            return Result.Success;
        }
    }
}
