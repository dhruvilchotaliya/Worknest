using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Team.Commands;

public record DeleteTeamCommand(Guid Id) : IRequest<ErrorOr<Deleted>>;
