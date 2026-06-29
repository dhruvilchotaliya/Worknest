using MediatR;
using System;
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
    public class AssignTaskCommandHandler : IRequestHandler<AssignTaskCommand, ErrorOr<Success>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProjectTaskRepository _projectTaskRepository;

        public AssignTaskCommandHandler(IUnitOfWork unitOfWork, IProjectTaskRepository projectTaskRepository)
        {
            _unitOfWork = unitOfWork;
            _projectTaskRepository = projectTaskRepository;
        }

        public async Task<ErrorOr<Success>> Handle(AssignTaskCommand request, CancellationToken cancellationToken)
        {
            var task = await _projectTaskRepository.GetTaskByIdAsync(request.Id, cancellationToken);
            if (task == null)
            {
                return Error.NotFound("Task.NotFound", $"Task with ID {request.Id} was not found.");
            }

            task.AssignedToEmployeeId = request.AssignedToEmployeeId;
            task.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success;
        }
    }
}
