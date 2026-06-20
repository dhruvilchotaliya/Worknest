using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjectService.Application.Repositories;
using ProjectService.Domain.Entities;
using ProjectService.Infrastructure.Data;

namespace ProjectService.Infrastructure.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly ProjectDbContext _projectDbContext;

        public ProjectRepository(ProjectDbContext projectDbContext)
        {
            _projectDbContext = projectDbContext;
        }

        public async Task<ICollection<Project>> GetAllProjectsAsync(CancellationToken cancellationToken)
        {
            return await _projectDbContext.Projects
                .Include(e => e.Members)
                .ToListAsync(cancellationToken);
        }

        public async Task<Project?> GetProjectByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _projectDbContext.Projects
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        }

        public async Task<List<ProjectMember>> GetProjectMembersAsync(Guid projectId, CancellationToken cancellationToken)
        { 
            return await _projectDbContext.ProjectMembers
                .Where(pm => pm.ProjectId == projectId)
                .ToListAsync(cancellationToken);
        }

        public async Task AddProjectAsync(Project project, List<ProjectMember>? projectMembers, CancellationToken cancellationToken)
        {
            await _projectDbContext.Projects.AddAsync(project, cancellationToken);
            
            if (projectMembers is not null && projectMembers.Count > 0)
            {
                await _projectDbContext.ProjectMembers.AddRangeAsync(projectMembers, cancellationToken);
            }

            await _projectDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateProjectAsync(Project project, CancellationToken cancellationToken) 
        {
            var projectToUpdate = await _projectDbContext.Projects
                .FirstOrDefaultAsync(p => p.Id == project.Id, cancellationToken);
            
            if (projectToUpdate is not null) 
            { 
                projectToUpdate.Name = project.Name;
                projectToUpdate.Description = project.Description;
                projectToUpdate.IsActive = project.IsActive;
                projectToUpdate.ClientName = project.ClientName;
                projectToUpdate.TeamId = project.TeamId;
                
                await _projectDbContext.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task DeleteProjectAsync(Guid id, CancellationToken cancellationToken)
        {
            var projectToDelete = await _projectDbContext.Projects
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
            
            if (projectToDelete != null)
            {
                _projectDbContext.Projects.Remove(projectToDelete);
                await _projectDbContext.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task AddProjectMembersAsync(List<ProjectMember> projectMembers, CancellationToken cancellationToken) 
        { 
            if (projectMembers.Count > 0)
            {
                await _projectDbContext.ProjectMembers.AddRangeAsync(projectMembers, cancellationToken);
            }
            await _projectDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<Project?> GetProjectWithMembersByIdAsync(Guid projectId, CancellationToken cancellationToken) 
        { 
            return await _projectDbContext.Projects
                .Include(e => e.Members)
                .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        }
    }
}

