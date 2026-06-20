namespace ProjectService.Domain.Entities
{
    public class Member
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public List<TechSkill>? TechnicalSkills { get; set; } 
        public DateTime? JoinedAt { get; set; }
    }
}
