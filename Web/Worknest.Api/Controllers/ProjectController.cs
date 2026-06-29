using MediatR;
using Microsoft.AspNetCore.Mvc;
using Worknest.Api.Controllers.Base;
using Worknest.Application.Features.Project.Commands;
using Worknest.Application.Features.Project.Queries;

namespace Worknest.Api.Controllers;

public class ProjectController : BaseController
{
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProjectById(Guid id)
    {
        return (await Mediator.Send(new GetProjectByIdQuery(id)))
            .Match(Ok, Problem);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProjects([FromQuery] GetAllProjectsQuery query)
    {
        return (await Mediator.Send(query))
            .Match(Ok, Problem);
    }

    [HttpPost]  
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectCommand command)
    {
        return (await Mediator.Send(command))
            .Match(result => Ok(result), Problem);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        return (await Mediator.Send(command))
            .Match(_ => Ok(), Problem);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        return (await Mediator.Send(new DeleteProjectCommand(id)))
            .Match(_ => NoContent(), Problem);
    }

    [HttpGet("{id:guid}/members")]
    public async Task<IActionResult> GetProjectMembers(Guid id)
    {
        return (await Mediator.Send(new GetProjectMembersQuery(id)))
            .Match(Ok, Problem);
    }

    [HttpPost("{id:guid}/members")]
    public async Task<IActionResult> AddProjectMembers(Guid id, [FromBody] List<Guid> employeeIds)
    {
        return (await Mediator.Send(new AddProjectMembersCommand(id, employeeIds)))
            .Match(_ => Ok(), Problem);
    }

    [HttpDelete("{id:guid}/members")]
    public async Task<IActionResult> RemoveProjectMembers(Guid id, [FromBody] List<Guid> employeeIds)
    {
        return (await Mediator.Send(new RemoveMembersFromProjectCommand(id, employeeIds)))
            .Match(_ => Ok(), Problem);
    }
}
