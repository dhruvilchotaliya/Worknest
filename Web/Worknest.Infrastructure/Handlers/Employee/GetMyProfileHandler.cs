using ErrorOr;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Queries;
using Worknest.Application.Repositories;
using Worknest.Application.Services;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class GetMyProfileHandler : IRequestHandler<GetMyProfileQuery, ErrorOr<CurrentUserContextDto>>
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IContextService _contextService;

        public GetMyProfileHandler(IEmployeeRepository employeeRepository, IContextService contextService)
        {
            _employeeRepository = employeeRepository;
            _contextService = contextService;
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
            if (employee == null)
            {
                return Error.NotFound("Employee.NotFound", $"Employee profile for Azure Object ID {_contextService.ObjectId.Value} was not found.");
            }

            var contextDto = new CurrentUserContextDto
            {
                Name = _contextService.Name,
                Email = _contextService.Email,
                ObjectId = _contextService.ObjectId,
                TenantId = _contextService.TenantId,
                Roles = _contextService.Roles
            };

            return contextDto;
        }
    }
}
