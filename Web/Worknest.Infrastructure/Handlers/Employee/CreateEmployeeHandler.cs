using MediatR;
using System;
using System.Threading;
using Worknest.Domain.Entities.Employee;
using System.Threading.Tasks;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Commands;
using Worknest.Application.Services;
using Worknest.Application.Repositories;
using Worknest.Infrastructure.Mappers;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class CreateEmployeeHandler : IRequestHandler<CreateEmployeeCommand, ErrorOr<EmployeeDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmployeeRepository _employeeRepository;

        public CreateEmployeeHandler(IUnitOfWork unitOfWork, IEmployeeRepository employeeRepository)
        {
            _unitOfWork = unitOfWork;
            _employeeRepository = employeeRepository;
        }

        public async Task<ErrorOr<EmployeeDto>> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
        {
            var employee = new Worknest.Domain.Entities.Employee.Employee
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Surname = request.Surname,
                Email = request.Email,
                Position = request.Position,
                TeamId = request.TeamId,
                JoinedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            await _employeeRepository.AddEmployeeAsync(employee, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return EmployeeMapper.ToDto(employee);
        }
    }
}
