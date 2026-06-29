using Worknest.Application.Features.Tasks;
using Worknest.Domain.Entities.Task;

namespace Worknest.Infrastructure.Mappers
{
    public static class ProjectTaskMapper
    {
        public static ProjectTaskDto ToDto(ProjectTask task)
        {
            if (task == null) return null!;
            return new ProjectTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                EstimatedHours = task.EstimatedHours,
                CompletedHours = task.CompletedHours,
                RemainingHours = task.RemainingHours,
                DueDate = task.DueDate,
                CompletedAt = task.CompletedAt,
                ProjectId = task.ProjectId,
                AssignedToEmployeeId = task.AssignedToEmployeeId,
                CreatedByEmployeeId = task.CreatedByEmployeeId,
                AttachmentUrl = task.AttachmentUrl,
                ReferenceLink = task.ReferenceLink,
                IsDeleted = task.IsDeleted,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt
            };
        }
    }
}
