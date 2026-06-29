using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Tasks.Commands;

public record DeleteTaskCommand(Guid Id) : IRequest<ErrorOr<Deleted>>;
