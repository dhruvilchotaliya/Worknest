using Microsoft.IdentityModel.Logging;
using Microsoft.OpenApi;
using Worknest.Api.Middlewares;
using Worknest.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// DEBUG: Enable PII logging to see actual token claim values in errors
IdentityModelEventSource.ShowPII = true;

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

if (builder.Environment.IsDevelopment())
{
    IdentityModelEventSource.ShowPII = true;
}


builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.UseInfrastructure(builder.Configuration);
builder.Services.UseAuthorization();
var swaggerScopes = builder.Configuration.GetSection("Swagger:Scopes")
    .Get<List<PreojectService.Api.SwaggerScope>>()
    ?? new List<PreojectService.Api.SwaggerScope>();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            AuthorizationCode = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new Uri(builder.Configuration.GetValue<string>("Swagger:AuthorizationUrl") ??
                                           throw new InvalidOperationException("Swagger:AuthorizationUrl is not configured")),
                TokenUrl = new Uri(builder.Configuration.GetValue<string>("Swagger:TokenUrl") ??
                                   throw new InvalidOperationException("Swagger:TokenUrl is not configured")),
                RefreshUrl = new Uri(builder.Configuration.GetValue<string>("Swagger:RefreshUrl") ??
                                     throw new InvalidOperationException("Swagger:RefreshUrl is not configured")),
                Scopes = swaggerScopes.ToDictionary(e => e.Scope, e => e.Description)
            }
        }
    });

    // Global security requirement — the 'document' parameter is required in Swashbuckle 10.x
    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("oauth2", document),
            swaggerScopes.Select(e => e.Scope).ToList()
        }
    });
});

var app = builder.Build();

app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Worknest API v1");

        options.OAuthClientId(
            builder.Configuration.GetValue<string>("Swagger:ClientId"));

        options.OAuthUsePkce();

        options.OAuthScopeSeparator(" ");

        options.OAuthAppName("Worknest Swagger");
    });
}

app.UseHttpsRedirection();

app.UseCors("ReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
