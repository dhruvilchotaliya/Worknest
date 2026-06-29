using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Commands;
using Worknest.Application.Services;
using Worknest.Application.Repositories;
using Worknest.Infrastructure.Mappers;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class RegisterEmployeeHandler : IRequestHandler<RegisterEmployeeCommand, ErrorOr<EmployeeDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmployeeRepository _employeeRepository;

        public RegisterEmployeeHandler(IUnitOfWork unitOfWork, IEmployeeRepository employeeRepository)
        {
            _unitOfWork = unitOfWork;
            _employeeRepository = employeeRepository;
        }

        public async Task<ErrorOr<EmployeeDto>> Handle(RegisterEmployeeCommand request, CancellationToken cancellationToken)
        {
            // Check if employee with same AzureObjectId already exists
            var existingByAzureId = await _employeeRepository.GetEmployeeByAzureObjectIdAsync(request.AzureObjectId, cancellationToken);
            if (existingByAzureId != null)
            {
                return Error.Conflict("Employee.AlreadyExists", $"An employee with Azure Object ID {request.AzureObjectId} is already registered.");
            }

            var employee = new Worknest.Domain.Entities.Employee.Employee
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Surname = request.Surname,
                Email = request.Email,
                Position = request.Position,
                TeamId = request.TeamId,
                AzureObjectId = request.AzureObjectId,
                ExperienceInYears = request.ExperienceInYears,
                PhoneNumber = request.PhoneNumber,
                DateOfBirth = request.DateOfBirth,
                Bio = request.Bio,
                WorkModel = request.WorkModel,
                JoinedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            await _employeeRepository.AddEmployeeAsync(employee, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return EmployeeMapper.ToDto(employee);
        }
    }
}
