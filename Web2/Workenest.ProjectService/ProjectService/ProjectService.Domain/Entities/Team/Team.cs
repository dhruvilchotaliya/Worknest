namespace ProjectService.Domain.Entities
{
    public class Team
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public Guid? TeamLeaderId { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime? ModifiedAt { get; set; }

        public ICollection<Project> Projects { get; set; } = [];
    }
}
