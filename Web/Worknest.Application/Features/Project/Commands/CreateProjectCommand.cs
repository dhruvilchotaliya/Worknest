using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Project.Commands;

public record CreateProjectCommand(
    string Name,
    string? Code,
    string? Description,
    string? ClientName,
    DateOnly? StartedAt,
    DateOnly? EndedAt,
    Guid? TeamId) : IRequest<ErrorOr<ProjectDto>>;

