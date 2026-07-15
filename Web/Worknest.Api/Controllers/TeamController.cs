using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Worknest.Api.Controllers.Base;
using Worknest.Application.Common.Constants;
using Worknest.Application.Features.Team.Commands;
using Worknest.Application.Features.Team.Queries;

namespace Worknest.Api.Controllers;

public class TeamController : BaseController
{
    [HttpGet("{id:guid}")]
    [Authorize(Policy = PolicyConstants.RequireAnyUser)]
    public async Task<IActionResult> GetById(Guid id)
    {
        return (await Mediator.Send(new GetTeamByIdQuery(id)))
            .Match(Ok, Problem);
    }

    [HttpGet]
    [Authorize(Policy = PolicyConstants.RequireAnyUser)]
    public async Task<IActionResult> GetAll()
    {
        return (await Mediator.Send(new GetAllTeamsQuery()))
            .Match(Ok, Problem);
    }

    [HttpPost]
    [Authorize(Policy = PolicyConstants.RequireAdmin)]
    public async Task<IActionResult> Create([FromBody] CreateTeamCommand command)
    {
        return (await Mediator.Send(command))
            .Match(result => Ok(result), Problem);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = PolicyConstants.RequireAdmin)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTeamCommand command)
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
        return (await Mediator.Send(new DeleteTeamCommand(id)))
            .Match(_ => NoContent(), Problem);
    }
}

