using MediatR;
using System;
using System.Collections.Generic;

namespace Worknest.Application.Features.Project.Commands;

public record AddProjectMembersCommand(Guid ProjectId, List<Guid> EmployeeIds) : IRequest;
