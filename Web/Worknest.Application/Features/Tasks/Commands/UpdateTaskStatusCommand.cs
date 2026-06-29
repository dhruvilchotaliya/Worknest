using ErrorOr;
using MediatR;
using System;
using TaskStatus = Worknest.Domain.Entities.Task.TaskStatus;

namespace Worknest.Application.Features.Tasks.Commands;

public record UpdateTaskStatusCommand(
    Guid Id,
    TaskStatus Status) : IRequest<ErrorOr<Success>>;
