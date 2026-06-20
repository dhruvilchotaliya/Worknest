using MediatR;
using Microsoft.AspNetCore.Mvc;
using Worknest.Application.Features.Project.Commands;
using Worknest.Application.Features.Project.Queries;

namespace Worknest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProjectController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProjectById(Guid id)
    {
        var result = await _mediator.Send(new GetProjectByIdQuery(id));
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProjects([FromQuery] GetAllProjectsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]  
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await _mediator.Send(command);
        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        await _mediator.Send(new DeleteProjectCommand(id));
        return Ok();
    }

    [HttpGet("{id:guid}/members")]
    public async Task<IActionResult> GetProjectMembers(Guid id)
    {
        var result = await _mediator.Send(new GetProjectMembersQuery(id));
        return Ok(result);
    }

    [HttpPost("{id:guid}/members")]
    public async Task<IActionResult> AddProjectMembers(Guid id, [FromBody] List<Guid> employeeIds)
    {
        await _mediator.Send(new AddProjectMembersCommand(id, employeeIds));
        return Ok();
    }

    [HttpDelete("{id:guid}/members")]
    public async Task<IActionResult> RemoveProjectMembers(Guid id, [FromBody] List<Guid> employeeIds)
    {
        await _mediator.Send(new RemoveMembersFromProjectCommand(id, employeeIds));
        return Ok();
    }
}
