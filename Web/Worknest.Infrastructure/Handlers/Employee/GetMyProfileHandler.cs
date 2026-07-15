using ErrorOr;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Queries;
using Worknest.Application.Repositories;
using Worknest.Application.Services;

using Microsoft.Extensions.Options;
using Worknest.Application.Common.Constants;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class GetMyProfileHandler : IRequestHandler<GetMyProfileQuery, ErrorOr<CurrentUserContextDto>>
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IContextService _contextService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly GraphSettings _graphSettings;

        public GetMyProfileHandler(
            IEmployeeRepository employeeRepository, 
            IContextService contextService,
            IUnitOfWork unitOfWork,
            IOptions<GraphSettings> graphSettings)
        {
            _employeeRepository = employeeRepository;
            _contextService = contextService;
            _unitOfWork = unitOfWork;
            _graphSettings = graphSettings.Value;
        }

        public async Task<ErrorOr<CurrentUserContextDto>> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
        {
            if (!_contextService.IsAuthenticated)
            {
                return Error.Unauthorized("Auth.Unauthenticated", "User is not authenticated. Please ensure you are sending a valid Authorization Bearer token.");
            }

            if (_contextService.ObjectId == null)
            {
                return Error.Unauthorized("Auth.MissingObjectId", "User is authenticated, but the Object ID claim (oid/sub) could not be resolved from token claims.");
            }

            var employee = await _employeeRepository.GetEmployeeByAzureObjectIdAsync(_contextService.ObjectId.Value, cancellationToken);
            if (employee == null && !string.IsNullOrEmpty(_contextService.Email))
            {
                employee = await _employeeRepository.GetEmployeeByEmailAsync(_contextService.Email, cancellationToken);
                if (employee != null)
                {
                    employee.AzureObjectId = _contextService.ObjectId.Value;
                    if (string.IsNullOrEmpty(employee.AzureEmail))
                    {
                        employee.AzureEmail = _contextService.Email;
                    }
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                }
            }

            if (employee == null)
            {
                return Error.NotFound("Employee.NotFound", $"Employee profile for Azure Object ID {_contextService.ObjectId.Value} was not found.");
            }

            var targetTenantId = Guid.TryParse(_graphSettings.TenantId, out var parsedTenant) ? parsedTenant : (Guid?)null;
            var currentTenantId = _contextService.TenantId;
            var requiresTenantSwitch = targetTenantId.HasValue && currentTenantId.HasValue && currentTenantId.Value != targetTenantId.Value;

            var contextDto = new CurrentUserContextDto
            {
                Name = _contextService.Name,
                Email = _contextService.Email,
                ObjectId = employee.Id,
                TenantId = _contextService.TenantId,
                Roles = _contextService.Roles,
                AzureEmail = employee.AzureEmail,
                IsGuestUser = employee.IsGuestUser,
                RequiresTenantSwitch = requiresTenantSwitch
            };

            return contextDto;
        }
    }
}
