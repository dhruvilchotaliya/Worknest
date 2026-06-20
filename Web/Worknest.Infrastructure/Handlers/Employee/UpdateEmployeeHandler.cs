using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Exceptions;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;
using Worknest.Infrastructure.Mappers;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class UpdateEmployeeHandler : IRequestHandler<UpdateEmployeeCommand, EmployeeDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmployeeRepository _employeeRepository;

        public UpdateEmployeeHandler(IUnitOfWork unitOfWork, IEmployeeRepository employeeRepository)
        {
            _unitOfWork = unitOfWork;
            _employeeRepository = employeeRepository;
        }

        public async Task<EmployeeDto> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
        {
            var employee = await _employeeRepository.GetEmployeeByIdAsync(request.Id, cancellationToken);
            if (employee == null)
            {
                throw new NotFoundException("Employee", request.Id);
            }

            employee.Name = !string.IsNullOrWhiteSpace(request.Name) ? request.Name : employee.Name;
            employee.Surname = !string.IsNullOrWhiteSpace(request.Surname) ? request.Surname : employee.Surname;
            employee.Email = !string.IsNullOrWhiteSpace(request.Email) ? request.Email : employee.Email;
            employee.TeamId = request.TeamId.HasValue ? request.TeamId : employee.TeamId;
            employee.Position = request.Position.HasValue ? request.Position : employee.Position;

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return EmployeeMapper.ToDto(employee);
        }
    }
}
