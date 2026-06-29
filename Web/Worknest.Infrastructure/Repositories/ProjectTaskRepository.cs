using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Repositories;
using Worknest.Domain.Entities.Task;

namespace Worknest.Infrastructure.Repositories
{
    public class ProjectTaskRepository : IProjectTaskRepository
    {
        private readonly PrimaryDbContext _primaryDbContext;

        public ProjectTaskRepository(PrimaryDbContext primaryDbContext)
        {
            _primaryDbContext = primaryDbContext;
        }

        public async Task<ProjectTask?> GetTaskByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _primaryDbContext.ProjectTasks
                .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted, cancellationToken);
        }

        public async Task<List<ProjectTask>> GetTasksByProjectIdAsync(Guid projectId, CancellationToken cancellationToken)
        {
            return await _primaryDbContext.ProjectTasks
                .Where(t => t.ProjectId == projectId && !t.IsDeleted)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<ProjectTask>> GetTasksAssignedToEmployeeAsync(Guid employeeId, CancellationToken cancellationToken)
        {
            return await _primaryDbContext.ProjectTasks
                .Where(t => t.AssignedToEmployeeId == employeeId && !t.IsDeleted)
                .ToListAsync(cancellationToken);
        }

        public Task CreateTaskAsync(ProjectTask task, CancellationToken cancellationToken)
        {
            _primaryDbContext.ProjectTasks.Add(task);
            return Task.CompletedTask;
        }

        public async Task DeleteTaskAsync(Guid id, CancellationToken cancellationToken)
        {
            var task = await GetTaskByIdAsync(id, cancellationToken);
            if (task != null)
            {
                task.IsDeleted = true;
                task.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
