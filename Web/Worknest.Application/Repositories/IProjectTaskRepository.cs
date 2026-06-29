using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Domain.Entities.Task;

namespace Worknest.Application.Repositories
{
    public interface IProjectTaskRepository
    {
        Task<ProjectTask?> GetTaskByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<List<ProjectTask>> GetTasksByProjectIdAsync(Guid projectId, CancellationToken cancellationToken);
        Task<List<ProjectTask>> GetTasksAssignedToEmployeeAsync(Guid employeeId, CancellationToken cancellationToken);
        Task CreateTaskAsync(ProjectTask task, CancellationToken cancellationToken);
        Task DeleteTaskAsync(Guid id, CancellationToken cancellationToken);
    }
}
