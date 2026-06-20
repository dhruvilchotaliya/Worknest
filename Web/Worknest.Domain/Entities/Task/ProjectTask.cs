namespace Worknest.Domain.Entities.Task
{
    public class ProjectTask
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public TaskStatus Status { get; set; } = TaskStatus.ToDo;

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        public decimal? EstimatedHours { get; set; }

        public decimal CompletedHours { get; set; }

        public decimal? RemainingHours { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? CompletedAt { get; set; }

        // Relationship with Project
        public Guid ProjectId { get; set; }

        public Worknest.Domain.Entities.Project.Project Project { get; set; } = null!;

        // Relationship with Employee
        public Guid? AssignedToEmployeeId { get; set; }

        public Employee.Employee? AssignedToEmployee { get; set; }

        // Who created the task
        public Guid CreatedByEmployeeId { get; set; }

        public Employee.Employee CreatedByEmployee { get; set; } = null!;

        // Optional simple attachment/link fields
        public string? AttachmentUrl { get; set; }

        public string? ReferenceLink { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
