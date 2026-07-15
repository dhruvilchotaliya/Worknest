using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Web;
using Worknest.Api.Controllers.Base;
using Worknest.Application.Common.Constants;
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
    [HttpGet("{id:guid}")]
    [Authorize(Policy = PolicyConstants.RequireAnyUser)]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetById(Guid id)
    {
        return (await Mediator.Send(new GetEmployeeByIdQuery(id)))
            .Match(Ok, Problem);
    }

    [HttpGet]
    [Authorize(Policy = PolicyConstants.RequireAnyUser)]
    [ProducesResponseType(typeof(Worknest.Application.Common.PaginatedResponse<EmployeeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAll([FromQuery] GetAllEmployeesQuery query)
    {
        return (await Mediator.Send(query))
            .Match(Ok, Problem);
    }

    [HttpPost]
    [Authorize(Policy = PolicyConstants.RequireAdmin)]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeCommand command)
    {
        return (await Mediator.Send(command))
            .Match(result => Ok(result), Problem);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = PolicyConstants.RequireAnyUser)]
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
    [Authorize(Policy = PolicyConstants.RequireAdmin)]
    public async Task<IActionResult> Delete(Guid id)
    {
        return (await Mediator.Send(new DeleteEmployeeCommand(id)))
            .Match(_ => NoContent(), Problem);
    }

    [HttpPut("{id:guid}/role")]
    [Authorize(Policy = PolicyConstants.RequireAdmin)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangeRole(Guid id, [FromBody] ChangeRoleRequest request)
    {
        var command = new ChangeEmployeeRoleCommand(id, request.NewRoleName);
        return (await Mediator.Send(command))
            .Match(_ => Ok(), Problem);
    }
}


public record ChangeRoleRequest(
    string NewRoleName);

