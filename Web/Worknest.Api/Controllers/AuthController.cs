using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Worknest.Api.Controllers.Base;
using Worknest.Application.Common.Constants;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Commands;
using Worknest.Domain.Entities.Employee;

namespace Worknest.Api.Controllers
{
    [Route("api/auth")]
    public class AuthController : BaseController
    {
        [HttpPost("onboard")]
        [Authorize(AuthenticationSchemes = "MultiTenant")]
        [ProducesResponseType(typeof(OnboardUserResultDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Onboard([FromBody] OnboardEmployeeRequest request)
        {
            var command = new OnboardUserCommand(
                request.Surname,
                request.Position,
                request.TeamId,
                request.ExperienceInYears,
                request.PhoneNumber,
                request.DateOfBirth,
                request.Bio,
                request.WorkModel
            );

            return (await Mediator.Send(command))
                .Match(result => Ok(result), Problem);
        }

        [HttpPost("register")]
        [Authorize]
        [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterEmployeeRequest request)
        {
            var command = new RegisterMyProfileCommand(
                request.Surname,
                request.Position,
                request.TeamId,
                request.ExperienceInYears,
                request.PhoneNumber,
                request.DateOfBirth,
                request.Bio,
                request.WorkModel
            );

            return (await Mediator.Send(command))
                .Match(result => Ok(result), Problem);
        }
    }

    public record RegisterEmployeeRequest(
        string Surname,
        EmployeePosition Position,
        Guid? TeamId,
        decimal? ExperienceInYears,
        string? PhoneNumber,
        DateTime? DateOfBirth,
        string? Bio,
        WorkModel? WorkModel);

    public record OnboardEmployeeRequest(
        string Surname,
        EmployeePosition Position,
        Guid? TeamId,
        decimal? ExperienceInYears,
        string? PhoneNumber,
        DateTime? DateOfBirth,
        string? Bio,
        WorkModel? WorkModel);
}
