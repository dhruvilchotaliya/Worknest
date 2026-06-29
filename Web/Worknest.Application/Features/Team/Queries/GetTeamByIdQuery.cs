using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Team.Queries;

public record GetTeamByIdQuery(Guid Id) : IRequest<ErrorOr<TeamDto>>;
