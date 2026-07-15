using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Web;
using System;
using System.Collections.Generic;
using System.Text;
using Worknest.Application.Common.Constants;

namespace Worknest.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection UseInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<PrimaryDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("ProjectDb"),
                    b => b.MigrationsAssembly(typeof(PrimaryDbContext).Assembly.FullName)));

            // Register Repositories and Services
            services.AddHttpContextAccessor();
            services.AddScoped<Worknest.Application.Services.IContextService, Worknest.Infrastructure.Services.ContextService>();
            services.AddScoped<Worknest.Application.Repositories.IProjectRepository, Worknest.Infrastructure.Repositories.ProjectRepository>();
            services.AddScoped<Worknest.Application.Repositories.IEmployeeRepository, Worknest.Infrastructure.Repositories.EmployeeRepository>();
            services.AddScoped<Worknest.Application.Repositories.IProjectTaskRepository, Worknest.Infrastructure.Repositories.ProjectTaskRepository>();
            services.AddScoped<Worknest.Application.Services.IUnitOfWork, Worknest.Infrastructure.Services.UnitOfWorkService>();

            // Register Microsoft Graph service for B2B guest management
            services.Configure<GraphSettings>(configuration.GetSection(GraphSettings.SectionName));
            services.AddSingleton<Worknest.Application.Services.IGraphService, Worknest.Infrastructure.Services.GraphService>();

            // Register MediatR handlers inside Infrastructure
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(System.Reflection.Assembly.GetExecutingAssembly()));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(configuration.GetSection(SettingConstants.WebApiAppRegistration));

            services.AddAuthentication()
                .AddJwtBearer("MultiTenant", options =>
                {
                    options.Authority = "https://login.microsoftonline.com/common/v2.0";
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidAudience = configuration["WebApi:ClientId"],
                        ValidateAudience = true,
                        ValidateLifetime = true
                    };
                });

            // DEBUG: Add event handlers via PostConfigure to chain with MI Web's handlers
            services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                var existingEvents = options.Events ?? new JwtBearerEvents();

                var originalOnAuthFailed = existingEvents.OnAuthenticationFailed;
                existingEvents.OnAuthenticationFailed = async context =>
                {
                    if (originalOnAuthFailed != null) await originalOnAuthFailed(context);
                    Console.WriteLine("========== AUTH FAILED ==========");
                    Console.WriteLine($"Exception Type: {context.Exception.GetType().Name}");
                    Console.WriteLine($"Exception Message: {context.Exception.Message}");
                    Console.WriteLine("=================================");
                };

                var originalOnValidated = existingEvents.OnTokenValidated;
                existingEvents.OnTokenValidated = async context =>
                {
                    if (originalOnValidated != null) await originalOnValidated(context);
                    Console.WriteLine("========== TOKEN VALIDATED ==========");
                    foreach (var claim in context.Principal?.Claims ?? [])
                        Console.WriteLine($"  {claim.Type}: {claim.Value}");
                    Console.WriteLine("=====================================");
                };

                var originalOnChallenge = existingEvents.OnChallenge;
                existingEvents.OnChallenge = async context =>
                {
                    if (originalOnChallenge != null) await originalOnChallenge(context);
                    Console.WriteLine("========== AUTH CHALLENGE ==========");
                    Console.WriteLine($"Error: {context.Error}");
                    Console.WriteLine($"Error Description: {context.ErrorDescription}");
                    Console.WriteLine($"Auth Failure: {context.AuthenticateFailure?.Message}");
                    Console.WriteLine("====================================");
                };

                options.Events = existingEvents;
            });


            return services;
        }

        public static IServiceCollection UseAuthorization(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(PolicyConstants.RequireAdmin, policy =>
                {
                    policy.RequireRole(RoleConstants.Admin);
                });

                options.AddPolicy(PolicyConstants.RequireProjectManager, policy =>
                {
                    policy.RequireRole(RoleConstants.Admin , RoleConstants.ProjectManager);
                });

                options.AddPolicy(PolicyConstants.RequireTeamLeader, policy =>
                {
                    policy.RequireRole(RoleConstants.Admin, RoleConstants.ProjectManager, RoleConstants.TeamLeader);
                });

                options.AddPolicy(PolicyConstants.RequireDeveloper ,policy =>
                {
                    policy.RequireRole(
                        RoleConstants.Admin,
                        RoleConstants.ProjectManager,
                        RoleConstants.TeamLeader,
                        RoleConstants.Developer
                    );
                });

                options.AddPolicy(PolicyConstants.RequireWorkContributor, policy =>
                {
                    policy.RequireRole( 
                        RoleConstants.Admin,
                        RoleConstants.ProjectManager,
                        RoleConstants.TeamLeader,
                        RoleConstants.Developer,
                        RoleConstants.FellowDeveloper,
                        RoleConstants.Trainee
                    );
                });

                options.AddPolicy(PolicyConstants.RequireAnyUser, policy =>
                {
                    policy.RequireRole(
                        RoleConstants.Admin,
                        RoleConstants.ProjectManager,
                        RoleConstants.TeamLeader,
                        RoleConstants.Developer,
                        RoleConstants.FellowDeveloper,
                        RoleConstants.User
                    );
                });
            });

            return services;
        }
    }
}
