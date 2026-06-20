using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Domain.Entities.Employee;
using Worknest.Domain.Entities.Project;

namespace Worknest.Application.Repositories
{
    public interface IProjectRepository
    {
        Task CreateProjectAsync(Project project, CancellationToken cancellationToken);
        Task<Worknest.Application.Common.PaginatedResponse<Project>> GetAllProjectsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task RemoveMembersFromProject(List<Guid> projectMembers, CancellationToken cancellationToken);
        Task<Project?> GetProjectByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<List<ProjectMember>> GetProjectMembersAsync(Guid projectId, CancellationToken cancellationToken);
        Task DeleteProjectAsync(Guid id, CancellationToken cancellationToken);
        Task AddProjectMembersAsync(List<ProjectMember> projectMembers, CancellationToken cancellationToken);
    }
}

