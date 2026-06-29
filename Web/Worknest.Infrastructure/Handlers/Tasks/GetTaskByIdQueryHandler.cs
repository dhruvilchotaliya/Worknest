using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Exceptions;
using Worknest.Application.Features.Tasks;
using Worknest.Application.Features.Tasks.Queries;
using Worknest.Application.Repositories;
using Worknest.Infrastructure.Mappers;
using Task = System.Threading.Tasks.Task;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Tasks
{
    public class GetTaskByIdQueryHandler : IRequestHandler<GetTaskByIdQuery, ErrorOr<ProjectTaskDto>>
    {
        private readonly IProjectTaskRepository _projectTaskRepository;

        public GetTaskByIdQueryHandler(IProjectTaskRepository projectTaskRepository)
        {
            _projectTaskRepository = projectTaskRepository;
        }

        public async Task<ErrorOr<ProjectTaskDto>> Handle(GetTaskByIdQuery request, CancellationToken cancellationToken)
        {
            var task = await _projectTaskRepository.GetTaskByIdAsync(request.Id, cancellationToken);
            if (task == null)
            {
                return Error.NotFound("Task.NotFound", $"Task with ID {request.Id} was not found.");
            }

            return ProjectTaskMapper.ToDto(task);
        }
    }
}
