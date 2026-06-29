using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Exceptions;
using Worknest.Application.Features.Tasks.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;
using Task = System.Threading.Tasks.Task;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Tasks
{
    public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand, ErrorOr<Deleted>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProjectTaskRepository _projectTaskRepository;

        public DeleteTaskCommandHandler(IUnitOfWork unitOfWork, IProjectTaskRepository projectTaskRepository)
        {
            _unitOfWork = unitOfWork;
            _projectTaskRepository = projectTaskRepository;
        }

        public async Task<ErrorOr<Deleted>> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
        {
            var task = await _projectTaskRepository.GetTaskByIdAsync(request.Id, cancellationToken);
            if (task == null)
            {
                return Error.NotFound("Task.NotFound", $"Task with ID {request.Id} was not found.");
            }

            await _projectTaskRepository.DeleteTaskAsync(request.Id, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Deleted;
        }
    }
}
