using MediatR;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Employee.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;

using ErrorOr;
using Task = System.Threading.Tasks.Task;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class DeleteEmployeeHandler : IRequestHandler<DeleteEmployeeCommand, ErrorOr<Deleted>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmployeeRepository _employeeRepository;

        public DeleteEmployeeHandler(IUnitOfWork unitOfWork, IEmployeeRepository employeeRepository)
        {
            _unitOfWork = unitOfWork;
            _employeeRepository = employeeRepository;
        }

        public async Task<ErrorOr<Deleted>> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
        {
            var employee = await _employeeRepository.GetEmployeeByIdAsync(request.Id, cancellationToken);
            if (employee == null)
            {
                return Error.NotFound("Employee.NotFound", $"Employee with ID {request.Id} was not found.");
            }

            await _employeeRepository.DeleteEmployeeAsync(request.Id, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Deleted;
        }
    }
}
