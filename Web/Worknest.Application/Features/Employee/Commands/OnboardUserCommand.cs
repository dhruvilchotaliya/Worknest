using ErrorOr;
using MediatR;
using System;
using Worknest.Domain.Entities.Employee;

namespace Worknest.Application.Features.Employee.Commands
{
    public record OnboardUserCommand(
        string Surname,
        EmployeePosition Position,
        Guid? TeamId,
        decimal? ExperienceInYears,
        string? PhoneNumber,
        DateTime? DateOfBirth,
        string? Bio,
        WorkModel? WorkModel) : IRequest<ErrorOr<OnboardUserResultDto>>;

    public class OnboardUserResultDto
    {
        public bool IsAlreadyRegistered { get; set; }
        public bool RequiresRedemption { get; set; }
        public string? InviteRedeemUrl { get; set; }
        public Guid? GuestUserId { get; set; }
        public EmployeeDto? Employee { get; set; }
    }
}
