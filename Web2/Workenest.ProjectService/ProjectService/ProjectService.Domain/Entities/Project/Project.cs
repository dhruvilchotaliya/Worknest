namespace Worknest.Domain.Entities
{
    public class Project
    {
        public Guid Id { get; set; }

        public Guid? TeamId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Code { get; set; }

        public ProjectStatus Status { get; set; } = ProjectStatus.Planning;

        public string? Description { get; set; }

        public string? ClientName { get; set; }

        public DateOnly? StartedAt { get; set; }

        public DateOnly? EndedAt { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime? ModifiedAt { get; set; }

        public Team? Team { get; set; }

        public ICollection<Employee> Members { get; set; } = [];
    }
}
