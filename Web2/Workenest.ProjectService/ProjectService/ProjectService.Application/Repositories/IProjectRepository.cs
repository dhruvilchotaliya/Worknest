using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ProjectService.Domain.Entities;

namespace ProjectService.Application.Repositories
{
    public interface IProjectRepository
    {
        Task<ICollection<Project>> GetAllProjectsAsync(CancellationToken cancellationToken);
        Task<Project?> GetProjectByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<List<ProjectMember>> GetProjectMembersAsync(Guid projectId, CancellationToken cancellationToken);
        Task AddProjectAsync(Project project, List<ProjectMember>? projectMembers, CancellationToken cancellationToken);
        Task UpdateProjectAsync(Project project, CancellationToken cancellationToken);
        Task DeleteProjectAsync(Guid id, CancellationToken cancellationToken);
        Task AddProjectMembersAsync(List<ProjectMember> projectMembers, CancellationToken cancellationToken);
        Task<Project?> GetProjectWithMembersByIdAsync(Guid projectId, CancellationToken cancellationToken);
    }
}

