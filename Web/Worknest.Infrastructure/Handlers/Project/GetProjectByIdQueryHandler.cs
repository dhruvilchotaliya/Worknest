using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project;
using Worknest.Application.Features.Project.Queries;
using Worknest.Application.Repositories;
using Worknest.Infrastructure.Mappers;

using ErrorOr;
using Task = System.Threading.Tasks.Task;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class GetProjectByIdQueryHandler : IRequestHandler<GetProjectByIdQuery, ErrorOr<ProjectDto>>
    {
        private readonly IProjectRepository _projectRepository;

        public GetProjectByIdQueryHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<ErrorOr<ProjectDto>> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
        {
            var project = await _projectRepository.GetProjectByIdAsync(request.Id, cancellationToken);
            if (project == null)
            {
                return Error.NotFound("Project.NotFound", $"Project with ID {request.Id} was not found.");
            }
            return ProjectMapper.ToDto(project);
        }
    }
}
