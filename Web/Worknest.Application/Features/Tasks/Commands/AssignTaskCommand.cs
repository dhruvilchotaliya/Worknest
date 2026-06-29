using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Tasks.Commands;

public record AssignTaskCommand(
    Guid Id,
    Guid? AssignedToEmployeeId) : IRequest<ErrorOr<Success>>;
