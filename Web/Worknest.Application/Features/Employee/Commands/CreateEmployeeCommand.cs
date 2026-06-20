using MediatR;
using System;
using System.Net;
using Worknest.Domain.Entities.Employee;

namespace Worknest.Application.Features.Employee.Commands;

public record CreateEmployeeCommand(
    string Name,
    string Surname,
    string Email,
    EmployeePosition Position,
    Guid? TeamId) : IRequest<EmployeeDto>;
