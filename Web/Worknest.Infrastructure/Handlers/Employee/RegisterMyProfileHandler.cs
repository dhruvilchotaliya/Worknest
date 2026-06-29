using ErrorOr;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;
using Worknest.Infrastructure.Mappers;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class RegisterMyProfileHandler : IRequestHandler<RegisterMyProfileCommand, ErrorOr<EmployeeDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IContextService _contextService;

        public RegisterMyProfileHandler(
            IUnitOfWork unitOfWork,
            IEmployeeRepository employeeRepository,
            IContextService contextService)
        {
            _unitOfWork = unitOfWork;
            _employeeRepository = employeeRepository;
            _contextService = contextService;
        }

        public async Task<ErrorOr<EmployeeDto>> Handle(RegisterMyProfileCommand request, CancellationToken cancellationToken)
        {
            if (!_contextService.IsAuthenticated || _contextService.ObjectId == null)
            {
                return Error.Unauthorized("Auth.Unauthorized", "User is not authenticated or Object ID claim is missing.");
            }

            var azureObjectId = _contextService.ObjectId.Value;
            var email = _contextService.Email;
            var name = _contextService.Name ?? "Microsoft User";

            if (string.IsNullOrEmpty(email))
            {
                return Error.Validation("Auth.MissingEmailClaim", "Email claim not found in user identity.");
            }

            // Check if employee with same AzureObjectId already exists
            var existingByAzureId = await _employeeRepository.GetEmployeeByAzureObjectIdAsync(azureObjectId, cancellationToken);
            if (existingByAzureId != null)
            {
                return Error.Conflict("Employee.AlreadyExists", $"An employee with Azure Object ID {azureObjectId} is already registered.");
            }

            var employee = new Worknest.Domain.Entities.Employee.Employee
            {
                Id = Guid.NewGuid(),
                Name = name,
                Surname = request.Surname,
                Email = email,
                Position = request.Position,
                TeamId = request.TeamId,
                AzureObjectId = azureObjectId,
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
