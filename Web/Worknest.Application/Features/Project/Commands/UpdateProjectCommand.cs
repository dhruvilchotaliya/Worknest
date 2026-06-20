using MediatR;
using System;

namespace Worknest.Application.Features.Project.Commands;

public record UpdateProjectCommand(
    Guid Id,
    string Name,
    string? Code,
    string? Description,
    string? ClientName,
    DateOnly? StartedAt,
    DateOnly? EndedAt,
    bool IsActive,
    Guid? TeamId) : IRequest;

