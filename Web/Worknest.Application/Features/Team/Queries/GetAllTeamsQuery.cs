using ErrorOr;
using MediatR;
using System.Collections.Generic;

namespace Worknest.Application.Features.Team.Queries;

public record GetAllTeamsQuery() : IRequest<ErrorOr<List<TeamDto>>>;
