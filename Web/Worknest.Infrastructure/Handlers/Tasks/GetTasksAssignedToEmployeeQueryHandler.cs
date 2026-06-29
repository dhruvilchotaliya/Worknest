using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Tasks;
using Worknest.Application.Features.Tasks.Queries;
using Worknest.Application.Repositories;
using Worknest.Infrastructure.Mappers;
using Task = System.Threading.Tasks.Task;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Tasks
{
    public class GetTasksAssignedToEmployeeQueryHandler : IRequestHandler<GetTasksAssignedToEmployeeQuery, ErrorOr<List<ProjectTaskDto>>>
    {
        private readonly IProjectTaskRepository _projectTaskRepository;

        public GetTasksAssignedToEmployeeQueryHandler(IProjectTaskRepository projectTaskRepository)
        {
            _projectTaskRepository = projectTaskRepository;
        }

        public async Task<ErrorOr<List<ProjectTaskDto>>> Handle(GetTasksAssignedToEmployeeQuery request, CancellationToken cancellationToken)
        {
            var tasks = await _projectTaskRepository.GetTasksAssignedToEmployeeAsync(request.EmployeeId, cancellationToken);
            return tasks.Select(ProjectTaskMapper.ToDto).ToList();
        }
    }
}
