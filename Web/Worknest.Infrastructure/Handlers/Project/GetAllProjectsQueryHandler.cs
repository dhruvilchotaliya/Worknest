using MediatR;
using Worknest.Application.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project;
using Worknest.Application.Features.Project.Queries;
using Worknest.Application.Repositories;
using Worknest.Infrastructure.Mappers;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class GetAllProjectsQueryHandler : IRequestHandler<GetAllProjectsQuery, ErrorOr<PaginatedResponse<ProjectDto>>>
    {
        private readonly IProjectRepository _projectRepository;

        public GetAllProjectsQueryHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<ErrorOr<PaginatedResponse<ProjectDto>>> Handle(GetAllProjectsQuery request, CancellationToken cancellationToken)
        {
            var pagedResult = await _projectRepository.GetAllProjectsAsync(request.PageNumber, request.PageSize, cancellationToken);
            var dtoList = pagedResult.Items.Select(p => ProjectMapper.ToDto(p)).ToList();
            
            return new PaginatedResponse<ProjectDto>(dtoList, pagedResult.TotalCount, request.PageNumber, request.PageSize);
        }
    }
}
