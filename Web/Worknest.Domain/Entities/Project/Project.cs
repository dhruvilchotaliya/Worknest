using System.Collections;
using Worknest.Domain.Entities.Common;
using Worknest.Domain.Entities.Employee;
using Worknest.Domain.Entities.Task;
using TeamEntity = Worknest.Domain.Entities.Team.Team;

namespace Worknest.Domain.Entities.Project
{
    public class Project : BaseEntity
    {
        public Guid? TeamId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Code { get; set; }

        public ProjectStatus Status { get; set; } = ProjectStatus.Planning;

        public string? Description { get; set; }

        public string? ClientName { get; set; }

        public DateOnly? StartedAt { get; set; }

        public DateOnly? EndedAt { get; set; }

        public bool IsActive { get; set; } = true;

        public TeamEntity? Team { get; set; }

        public ICollection<ProjectMember>? Members { get; set; }

        public ICollection<ProjectTask>? ProjectTasks { get; set; }
    }
}
