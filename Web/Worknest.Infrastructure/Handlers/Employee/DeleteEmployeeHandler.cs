using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Employee.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class DeleteEmployeeHandler : IRequestHandler<DeleteEmployeeCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmployeeRepository _employeeRepository;

        public DeleteEmployeeHandler(IUnitOfWork unitOfWork, IEmployeeRepository employeeRepository)
        {
            _unitOfWork = unitOfWork;
            _employeeRepository = employeeRepository;
        }

        public async Task<Unit> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
        {
            await _employeeRepository.DeleteEmployeeAsync(request.Id, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
