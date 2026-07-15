using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Web;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using Worknest.Application.Services;
using Worknest.Application.Common.Constants;

namespace Worknest.Infrastructure.Services
{
    public class ContextService : IContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

        public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

        public string? Name => User?.FindFirst("name")?.Value 
            ?? User?.FindFirst(ClaimTypes.Name)?.Value;

        public Guid? ObjectId
        {
            get
            {
                var objectIdStr = User?.GetObjectId() 
                    ?? User?.FindFirst("oid")?.Value 
                    ?? User?.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value
                    ?? User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User?.FindFirst("sub")?.Value;
                
                return Guid.TryParse(objectIdStr, out var id) ? id : null;
            }
        }

        public Guid? TenantId
        {
            get
            {
                var tenantIdStr = User?.GetTenantId() 
                    ?? User?.FindFirst("tid")?.Value 
                    ?? User?.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid")?.Value;
                
                return Guid.TryParse(tenantIdStr, out var id) ? id : null;
            }
        }

        public string? Email => User?.FindFirst("preferred_username")?.Value 
            ?? User?.FindFirst("email")?.Value
            ?? User?.FindFirst("unique_name")?.Value
            ?? User?.FindFirst(ClaimTypes.Email)?.Value 
            ?? User?.FindFirst(ClaimTypes.Upn)?.Value;

        public string? Role => User?.FindFirst(ClaimTypes.Role)?.Value 
            ?? User?.FindFirst("roles")?.Value 
            ?? User?.FindFirst("role")?.Value
            ?? (IsAuthenticated ? RoleConstants.User : null);

        public IEnumerable<string> Roles
        {
            get
            {
                if (User == null) yield break;

                bool hasAnyRole = false;
                foreach (var claim in User.Claims)
                {
                    if (claim.Type == ClaimTypes.Role || claim.Type == "roles" || claim.Type == "role")
                    {
                        hasAnyRole = true;
                        yield return claim.Value;
                    }
                }

                if (!hasAnyRole && IsAuthenticated)
                {
                    yield return RoleConstants.User;
                }
            }
        }
    }
}
