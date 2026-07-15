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
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Bio { get; set; }
        public WorkModel? WorkModel { get; set; }
        public string? AzureEmail { get; set; }
        public bool IsGuestUser { get; set; }
    }
}
