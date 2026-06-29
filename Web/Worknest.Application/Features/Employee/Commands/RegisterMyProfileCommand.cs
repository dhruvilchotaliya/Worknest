using ErrorOr;
using MediatR;
using System;
using Worknest.Domain.Entities.Employee;

namespace Worknest.Application.Features.Employee.Commands
{
    public record RegisterMyProfileCommand(
        string Surname,
        EmployeePosition Position,
        Guid? TeamId,
        decimal? ExperienceInYears,
        string? PhoneNumber,
        DateTime? DateOfBirth,
        string? Bio,
        WorkModel? WorkModel) : IRequest<ErrorOr<EmployeeDto>>;
}
