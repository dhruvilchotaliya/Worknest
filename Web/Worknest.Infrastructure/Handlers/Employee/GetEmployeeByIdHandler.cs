using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Exceptions;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Queries;
using Worknest.Application.Repositories;
using Worknest.Infrastructure.Mappers;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class GetEmployeeByIdHandler : IRequestHandler<GetEmployeeByIdQuery, EmployeeDto>
    {
        private readonly IEmployeeRepository _employeeRepository;

        public GetEmployeeByIdHandler(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<EmployeeDto> Handle(GetEmployeeByIdQuery request, CancellationToken cancellationToken)
        {
            var employee = await _employeeRepository.GetEmployeeByIdAsync(request.Id, cancellationToken);
            if (employee == null)
            {
                throw new NotFoundException("Employee", request.Id);
            }

            return EmployeeMapper.ToDto(employee);
        }
    }
}
