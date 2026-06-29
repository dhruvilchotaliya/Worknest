using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Team.Commands;

public record UpdateTeamCommand(
    Guid Id,
    string Name,
    string? Description,
    Guid? TeamLeaderId,
    bool IsActive) : IRequest<ErrorOr<TeamDto>>;
