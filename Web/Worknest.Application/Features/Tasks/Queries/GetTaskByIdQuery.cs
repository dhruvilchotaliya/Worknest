using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Tasks.Queries;

public record GetTaskByIdQuery(Guid Id) : IRequest<ErrorOr<ProjectTaskDto>>;
