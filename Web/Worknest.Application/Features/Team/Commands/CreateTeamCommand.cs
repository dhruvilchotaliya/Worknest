using System;

namespace Worknest.Application.Features.Team.Commands;

public record CreateTeamCommand(
    string Name,
    string? Description,
    Guid? TeamLeaderId);
