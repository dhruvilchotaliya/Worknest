using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Web;
using Worknest.Api.Controllers.Base;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Commands;
using Worknest.Application.Features.Employee.Queries;
using Worknest.Application.Services;
using Worknest.Domain.Entities.Employee;
using System;
using System.Threading.Tasks;

namespace Worknest.Api.Controllers;

public class EmployeeController : BaseController
{
    [HttpPost("register")]
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

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetById(Guid id)
    {
        return (await Mediator.Send(new GetEmployeeByIdQuery(id)))
            .Match(Ok, Problem);
    }

    [HttpGet]
    [ProducesResponseType(typeof(Worknest.Application.Common.PaginatedResponse<EmployeeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAll([FromQuery] GetAllEmployeesQuery query)
    {
        return (await Mediator.Send(query))
            .Match(Ok, Problem);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeCommand command)
    {
        return (await Mediator.Send(command))
            .Match(result => Ok(result), Problem);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEmployeeCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }
        
        return (await Mediator.Send(command))
            .Match(Ok, Problem);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        return (await Mediator.Send(new DeleteEmployeeCommand(id)))
            .Match(_ => NoContent(), Problem);
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
