using System;
using Worknest.Domain.Entities.Employee;

namespace Worknest.Application.Features.Employee
{
    public class EmployeeDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Email { get; set; }
        public EmployeePosition? Position { get; set; }
        public Guid? TeamId { get; set; }
        public DateTime JoinedAt { get; set; }
    }
}
