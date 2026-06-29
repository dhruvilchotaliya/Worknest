using MediatR;
using Microsoft.AspNetCore.Mvc;
using Worknest.Api.Controllers.Base;
using Worknest.Application.Features.Team.Commands;
using Worknest.Application.Features.Team.Queries;

namespace Worknest.Api.Controllers;

public class TeamController : BaseController
{
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        return (await Mediator.Send(new GetTeamByIdQuery(id)))
            .Match(Ok, Problem);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return (await Mediator.Send(new GetAllTeamsQuery()))
            .Match(Ok, Problem);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTeamCommand command)
    {
        return (await Mediator.Send(command))
            .Match(result => Ok(result), Problem);
    }

    [HttpPut("{id:guid}")]
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
    public async Task<IActionResult> Delete(Guid id)
    {
        return (await Mediator.Send(new DeleteTeamCommand(id)))
            .Match(_ => NoContent(), Problem);
    }
}
