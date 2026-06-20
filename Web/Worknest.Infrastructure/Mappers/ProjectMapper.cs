using Worknest.Application.Features.Project;
using Worknest.Domain.Entities.Project;

namespace Worknest.Infrastructure.Mappers
{
    public static class ProjectMapper
    {
        public static ProjectDto ToDto(Project project)
        {
            if (project == null) return null!;
            return new ProjectDto
            {
                Id = project.Id,
                TeamId = project.TeamId,
                Name = project.Name,
                Code = project.Code,
                Description = project.Description,
                ClientName = project.ClientName,
                StartedAt = project.StartedAt,
                EndedAt = project.EndedAt,
                IsActive = project.IsActive
            };
        }
    }
}
