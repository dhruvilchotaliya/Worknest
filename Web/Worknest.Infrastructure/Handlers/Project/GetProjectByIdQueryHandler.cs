using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project;
using Worknest.Application.Features.Project.Queries;
using Worknest.Application.Repositories;
using Worknest.Infrastructure.Mappers;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class GetProjectByIdQueryHandler : IRequestHandler<GetProjectByIdQuery, ProjectDto>
    {
        private readonly IProjectRepository _projectRepository;

        public GetProjectByIdQueryHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<ProjectDto> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
        {
            var project = await _projectRepository.GetProjectByIdAsync(request.Id, cancellationToken);
            return ProjectMapper.ToDto(project!);
        }
    }
}
