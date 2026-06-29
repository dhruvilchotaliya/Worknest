using Worknest.Domain.Entities.Common;
using Worknest.Domain.Entities.Task;

namespace Worknest.Domain.Entities.Employee
{
    public class Employee : BaseEntity
    {
        public string? Surname { get; set; }
        public string? Name { get; set; }
        public DateTime JoinedAt { get; set; }
        public EmployeePosition? Position { get; set; }
        public string? Email { get; set; }
        public Guid? TeamId { get; set; }
        public Team.Team? Team { get; set; }
        public Team.Team? LedTeam { get; set; }
        public Guid? AzureObjectId { get; set; }
        public decimal? ExperienceInYears { get; set; }
        public List<TechSkill>? TechnicalSkills { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Bio { get; set; }
        public WorkModel? WorkModel { get; set; }
        public ICollection<ProjectTask>? AssignedTasks { get; set; }
        public ICollection<ProjectTask>? CreatedTasks { get; set; }
    }
}
