using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Project.Queries;

public record GetProjectByIdQuery(Guid Id) : IRequest<ErrorOr<ProjectDto>>;

