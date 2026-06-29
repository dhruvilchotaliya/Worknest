using ErrorOr;
using MediatR;
using System;
using System.Collections.Generic;

namespace Worknest.Application.Features.Tasks.Queries;

public record GetTasksByProjectIdQuery(Guid ProjectId) : IRequest<ErrorOr<List<ProjectTaskDto>>>;
