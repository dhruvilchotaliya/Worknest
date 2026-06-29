using ErrorOr;
using MediatR;
using System;
using Worknest.Domain.Entities.Employee;

namespace Worknest.Application.Features.Employee.Commands;

public record RegisterEmployeeCommand(
    string Name,
    string Surname,
    string Email,
    EmployeePosition Position,
    Guid? TeamId,
    Guid AzureObjectId,
    decimal? ExperienceInYears,
    string? PhoneNumber,
    DateTime? DateOfBirth,
    string? Bio,
    WorkModel? WorkModel) : IRequest<ErrorOr<EmployeeDto>>;
