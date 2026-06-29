using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project;
using Worknest.Application.Features.Project.Queries;
using Worknest.Application.Repositories;

using ErrorOr;
using Task = System.Threading.Tasks.Task;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class GetProjectMembersQueryHandler : IRequestHandler<GetProjectMembersQuery, ErrorOr<IEnumerable<ProjectMemberDto>>>
    {
        private readonly IProjectRepository _projectRepository;

        public GetProjectMembersQueryHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<ErrorOr<IEnumerable<ProjectMemberDto>>> Handle(GetProjectMembersQuery request, CancellationToken cancellationToken)
        {
            var project = await _projectRepository.GetProjectByIdAsync(request.ProjectId, cancellationToken);
            if (project == null)
            {
                return Error.NotFound("Project.NotFound", $"Project with ID {request.ProjectId} was not found.");
            }

            var members = await _projectRepository.GetProjectMembersAsync(request.ProjectId, cancellationToken);
            return members.Select(m => new ProjectMemberDto
            {
                Id = m.Id,
                ProjectId = m.ProjectId,
                EmployeeId = m.EmployeeId
            }).ToList();
        }
    }
}
