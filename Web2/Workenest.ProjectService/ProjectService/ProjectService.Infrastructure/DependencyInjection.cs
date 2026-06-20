using System;
using System.Collections.Generic;
using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Web;
using ProjectService.Application.Common.Constants;
using ProjectService.Infrastructure.Data;

namespace ProjectService.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection UseInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ProjectDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("ProjectDb"),
                    b => b.MigrationsAssembly(typeof(ProjectDbContext).Assembly.FullName)));

            services.AddScoped<ProjectService.Application.Repositories.IProjectRepository, ProjectService.Infrastructure.Repositories.ProjectRepository>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(configuration.GetSection(SettingConstants.WebApiAppRegistration));

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
