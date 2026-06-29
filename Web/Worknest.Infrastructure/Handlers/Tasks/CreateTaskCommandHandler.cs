using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Tasks;
using Worknest.Application.Features.Tasks.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;
using Worknest.Domain.Entities.Task;
using Worknest.Infrastructure.Mappers;
using Task = System.Threading.Tasks.Task;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Tasks
{
    public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, ErrorOr<ProjectTaskDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProjectTaskRepository _projectTaskRepository;

        public CreateTaskCommandHandler(IUnitOfWork unitOfWork, IProjectTaskRepository projectTaskRepository)
        {
            _unitOfWork = unitOfWork;
            _projectTaskRepository = projectTaskRepository;
        }

        public async Task<ErrorOr<ProjectTaskDto>> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
        {
            var task = new ProjectTask
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                Status = request.Status,
                Priority = request.Priority,
                EstimatedHours = request.EstimatedHours,
                CompletedHours = 0,
                RemainingHours = request.RemainingHours ?? request.EstimatedHours,
                DueDate = request.DueDate,
                ProjectId = request.ProjectId,
                AssignedToEmployeeId = request.AssignedToEmployeeId,
                CreatedByEmployeeId = request.CreatedByEmployeeId,
                ReferenceLink = request.ReferenceLink,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow
            };

            await _projectTaskRepository.CreateTaskAsync(task, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return ProjectTaskMapper.ToDto(task);
        }
    }
}
