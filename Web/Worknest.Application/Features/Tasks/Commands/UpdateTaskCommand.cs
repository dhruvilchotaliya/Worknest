using ErrorOr;
using MediatR;
using System;
using TaskStatus = Worknest.Domain.Entities.Task.TaskStatus;
using TaskPriority = Worknest.Domain.Entities.Task.TaskPriority;

namespace Worknest.Application.Features.Tasks.Commands;

public record UpdateTaskCommand(
    Guid Id,
    string Title,
    string? Description,
    TaskStatus Status,
    TaskPriority Priority,
    DateTime? DueDate,
    Guid? AssignedToEmployeeId,
    string? ReferenceLink) : IRequest<ErrorOr<ProjectTaskDto>>;
