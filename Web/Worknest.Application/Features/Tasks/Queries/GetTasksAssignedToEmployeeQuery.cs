using ErrorOr;
using MediatR;
using System;
using System.Collections.Generic;

namespace Worknest.Application.Features.Tasks.Queries;

public record GetTasksAssignedToEmployeeQuery(Guid EmployeeId) : IRequest<ErrorOr<List<ProjectTaskDto>>>;
