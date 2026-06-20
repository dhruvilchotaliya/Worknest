using MediatR;
using System;
using Worknest.Domain.Entities.Employee;

namespace Worknest.Application.Features.Employee.Commands;

public record UpdateEmployeeCommand(
    Guid Id,
    string? Name,
    string? Surname,
    string? Email,
    EmployeePosition? Position,
    DateTime? JoinedAt,
    Guid? TeamId) : IRequest<EmployeeDto>;
