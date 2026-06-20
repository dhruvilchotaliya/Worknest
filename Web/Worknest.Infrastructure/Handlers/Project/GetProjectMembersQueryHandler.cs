using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project;
using Worknest.Application.Features.Project.Queries;
using Worknest.Application.Repositories;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class GetProjectMembersQueryHandler : IRequestHandler<GetProjectMembersQuery, IEnumerable<ProjectMemberDto>>
    {
        private readonly IProjectRepository _projectRepository;

        public GetProjectMembersQueryHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<IEnumerable<ProjectMemberDto>> Handle(GetProjectMembersQuery request, CancellationToken cancellationToken)
        {
            var members = await _projectRepository.GetProjectMembersAsync(request.ProjectId, cancellationToken);
            return members.Select(m => new ProjectMemberDto
            {
                Id = m.Id,
                ProjectId = m.ProjectId,
                EmployeeId = m.EmployeeId
            });
        }
    }
}
