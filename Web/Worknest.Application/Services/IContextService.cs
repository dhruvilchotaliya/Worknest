using System;
using System.Collections.Generic;

namespace Worknest.Application.Services
{
    public interface IContextService
    {
        string? Name { get; }
        Guid? ObjectId { get; }
        Guid? TenantId { get; }
        string? Email { get; }
        string? Role { get; }
        IEnumerable<string> Roles { get; }
        bool IsAuthenticated { get; }
    }
}
