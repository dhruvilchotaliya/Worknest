using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Exceptions;
using Worknest.Application.Features.Tasks.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;
using TaskStatus = Worknest.Domain.Entities.Task.TaskStatus;
using Task = System.Threading.Tasks.Task;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Tasks
{
    public class UpdateTaskStatusCommandHandler : IRequestHandler<UpdateTaskStatusCommand, ErrorOr<Success>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProjectTaskRepository _projectTaskRepository;

        public UpdateTaskStatusCommandHandler(IUnitOfWork unitOfWork, IProjectTaskRepository projectTaskRepository)
        {
            _unitOfWork = unitOfWork;
            _projectTaskRepository = projectTaskRepository;
        }

        public async Task<ErrorOr<Success>> Handle(UpdateTaskStatusCommand request, CancellationToken cancellationToken)
        {
            var task = await _projectTaskRepository.GetTaskByIdAsync(request.Id, cancellationToken);
            if (task == null)
            {
                return Error.NotFound("Task.NotFound", $"Task with ID {request.Id} was not found.");
            }

            task.Status = request.Status;
            task.UpdatedAt = DateTime.UtcNow;

            if (request.Status == TaskStatus.Completed)
            {
                task.CompletedAt = DateTime.UtcNow;
            }
            else
            {
                task.CompletedAt = null;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success;
        }
    }
}
