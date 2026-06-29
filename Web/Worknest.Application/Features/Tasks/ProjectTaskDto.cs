using System;
using TaskStatus = Worknest.Domain.Entities.Task.TaskStatus;
using TaskPriority = Worknest.Domain.Entities.Task.TaskPriority;

namespace Worknest.Application.Features.Tasks
{
    public class ProjectTaskDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; }
        public decimal? EstimatedHours { get; set; }
        public decimal CompletedHours { get; set; }
        public decimal? RemainingHours { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public Guid ProjectId { get; set; }
        public Guid? AssignedToEmployeeId { get; set; }
        public Guid CreatedByEmployeeId { get; set; }
        public string? AttachmentUrl { get; set; }
        public string? ReferenceLink { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
