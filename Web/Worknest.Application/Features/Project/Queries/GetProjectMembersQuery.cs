using MediatR;
using System;
using System.Collections.Generic;

namespace Worknest.Application.Features.Project.Queries;

public record GetProjectMembersQuery(Guid ProjectId) : IRequest<IEnumerable<ProjectMemberDto>>;
