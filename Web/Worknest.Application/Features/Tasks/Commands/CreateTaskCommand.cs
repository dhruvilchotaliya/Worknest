using ErrorOr;
using MediatR;
using System;
using TaskStatus = Worknest.Domain.Entities.Task.TaskStatus;
using TaskPriority = Worknest.Domain.Entities.Task.TaskPriority;

namespace Worknest.Application.Features.Tasks.Commands;

public record CreateTaskCommand(
    string Title,
    string? Description,
    TaskStatus Status,
    TaskPriority Priority,
    decimal? EstimatedHours,
    decimal? RemainingHours,
    DateTime? DueDate,
    Guid ProjectId,
    Guid? AssignedToEmployeeId,
    Guid CreatedByEmployeeId,
    string? ReferenceLink) : IRequest<ErrorOr<ProjectTaskDto>>;
