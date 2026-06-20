using MediatR;
using Worknest.Application.Common;

namespace Worknest.Application.Features.Project.Queries;

public record GetAllProjectsQuery : PagedRequest<ProjectDto>;


