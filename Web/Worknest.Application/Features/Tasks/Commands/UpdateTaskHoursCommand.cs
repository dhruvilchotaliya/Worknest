using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Tasks.Commands;

public record UpdateTaskHoursCommand(
    Guid Id,
    decimal? EstimatedHours,
    decimal CompletedHours,
    decimal? RemainingHours) : IRequest<ErrorOr<Success>>;
