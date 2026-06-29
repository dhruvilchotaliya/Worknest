using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Worknest.Api.Filters;

/// <summary>
/// Swagger operation filter that adds OAuth2 security requirements to endpoints
/// that have the [Authorize] attribute. This ensures Swagger UI sends the Bearer
/// token with API requests.
/// </summary>
public class OAuthSecurityOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        // Check if the endpoint has [Authorize] attribute (on method or controller)
        var hasAuthorize = context.MethodInfo
            .GetCustomAttributes(true)
            .OfType<AuthorizeAttribute>()
            .Any();

        if (!hasAuthorize)
        {
            hasAuthorize = context.MethodInfo.DeclaringType?
                .GetCustomAttributes(true)
                .OfType<AuthorizeAttribute>()
                .Any() ?? false;
        }

        // Check if it has [AllowAnonymous] which overrides [Authorize]
        var hasAllowAnonymous = context.MethodInfo
            .GetCustomAttributes(true)
            .OfType<AllowAnonymousAttribute>()
            .Any();

        if (!hasAuthorize || hasAllowAnonymous)
            return;

        // Add 401/403 responses
        operation.Responses.TryAdd("401", new OpenApiResponse { Description = "Unauthorized" });
        operation.Responses.TryAdd("403", new OpenApiResponse { Description = "Forbidden" });

        // Add the OAuth2 security requirement using OpenApiSecuritySchemeReference
        // In Swashbuckle 10.x / Microsoft.OpenApi v2, OpenApiReference was removed.
        // Use OpenApiSecuritySchemeReference directly as the dictionary key.
        var oauthScheme = new OpenApiSecuritySchemeReference("oauth2");

        operation.Security = new List<OpenApiSecurityRequirement>
        {
            new OpenApiSecurityRequirement
            {
                [oauthScheme] = new List<string> { "api://9f40ec9c-9903-49fd-811d-8f7dd5a5464a/access_as_user" }
            }
        };
    }
}
