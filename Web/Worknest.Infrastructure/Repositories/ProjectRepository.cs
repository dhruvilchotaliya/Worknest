using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Repositories;
using Worknest.Domain.Entities.Employee;
using Worknest.Domain.Entities.Project;

namespace Worknest.Infrastructure.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly PrimaryDbContext _primaryDbContext;

        public ProjectRepository(PrimaryDbContext projectDbContext)
        {
            _primaryDbContext = projectDbContext;
        }

        public async Task<Worknest.Application.Common.PaginatedResponse<Project>> GetAllProjectsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = _primaryDbContext.Projects
                .AsNoTracking()
                .Include(e => e.Team)
                    .ThenInclude(t => t!.TeamMembers)
                .Include(p => p.Team)
                    .ThenInclude(e => e!.TeamLeader);

            var totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return new Worknest.Application.Common.PaginatedResponse<Project>(items, totalCount, pageNumber, pageSize);
        }

        public async Task RemoveMembersFromProject(List<Guid> projectMembers, CancellationToken cancellationToken) 
        { 
            await _primaryDbContext.ProjectMembers
                .Where(pm => projectMembers.Contains(pm.Id))
                .ExecuteDeleteAsync();
        }

        public Task CreateProjectAsync(Project project, CancellationToken cancellationToken) { 
            _primaryDbContext.Projects.Add(project);
            return Task.CompletedTask;
        }

        public async Task<Project?> GetProjectByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _primaryDbContext.Projects
                .Include(e => e.Members)
                .Include(e => e.Team)
                    .ThenInclude(t => t!.TeamMembers)
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        }

        public async Task<List<ProjectMember>> GetProjectMembersAsync(Guid projectId, CancellationToken cancellationToken)
        { 
            return await _primaryDbContext.ProjectMembers
                .Where(pm => pm.ProjectId == projectId)
                .ToListAsync(cancellationToken);
        }

        public async Task DeleteProjectAsync(Guid id, CancellationToken cancellationToken)
        {
            var projectToDelete = await _primaryDbContext.Projects
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
            
            if (projectToDelete != null)
            {
                _primaryDbContext.Projects.Remove(projectToDelete);
                await _primaryDbContext.SaveChangesAsync(cancellationToken);
            }
            
        }

        public async Task AddProjectMembersAsync(List<ProjectMember> projectMembers, CancellationToken cancellationToken) 
        { 
            if (projectMembers.Count > 0)
            {
                await _primaryDbContext.ProjectMembers.AddRangeAsync(projectMembers, cancellationToken);
            }
            await _primaryDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}

