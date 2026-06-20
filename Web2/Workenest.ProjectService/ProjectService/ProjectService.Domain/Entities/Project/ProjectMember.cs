namespace Worknest.Domain.Entities
{
    public class Employee
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public List<TechSkill>? TechnicalSkills { get; set; } 
        public DateTime? JoinedAt { get; set; }
    }
}
