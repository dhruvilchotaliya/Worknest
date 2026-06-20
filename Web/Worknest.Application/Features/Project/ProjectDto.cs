using System;

namespace Worknest.Application.Features.Project
{
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public Guid? TeamId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string? Description { get; set; }
        public string? ClientName { get; set; }
        public DateOnly? StartedAt { get; set; }
        public DateOnly? EndedAt { get; set; }
        public bool IsActive { get; set; }
    }
}

