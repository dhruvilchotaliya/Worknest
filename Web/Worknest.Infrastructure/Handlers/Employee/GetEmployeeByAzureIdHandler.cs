using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Queries;
using Worknest.Application.Repositories;
using Worknest.Infrastructure.Mappers;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class GetEmployeeByAzureIdHandler : IRequestHandler<GetEmployeeByAzureIdQuery, ErrorOr<EmployeeDto>>
    {
        private readonly IEmployeeRepository _employeeRepository;

        public GetEmployeeByAzureIdHandler(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<ErrorOr<EmployeeDto>> Handle(GetEmployeeByAzureIdQuery request, CancellationToken cancellationToken)
        {
            var employee = await _employeeRepository.GetEmployeeByAzureObjectIdAsync(request.AzureObjectId, cancellationToken);
            if (employee == null)
            {
                return Error.NotFound("Employee.NotFound", $"Employee with Azure Object ID {request.AzureObjectId} was not found.");
            }

            return EmployeeMapper.ToDto(employee);
        }
    }
}
