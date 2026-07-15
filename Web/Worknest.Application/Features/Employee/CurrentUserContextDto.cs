using System;
using System.Collections.Generic;

namespace Worknest.Application.Features.Employee
{
    public class CurrentUserContextDto
    {
        public Guid? ObjectId { get; set; }
        public Guid? TenantId { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public IEnumerable<string> Roles { get; set; } = Array.Empty<string>();
        public bool IsGuestUser { get; set; }
        public bool RequiresTenantSwitch { get; set; }
    }
}
