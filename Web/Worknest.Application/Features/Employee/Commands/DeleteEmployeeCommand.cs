using MediatR;
using System;

namespace Worknest.Application.Features.Employee.Commands;

public record DeleteEmployeeCommand(Guid Id) : IRequest<Unit>;
