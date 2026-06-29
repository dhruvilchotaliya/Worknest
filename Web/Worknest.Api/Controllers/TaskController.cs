using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Worknest.Api.Controllers.Base;
using Worknest.Application.Features.Tasks;
using Worknest.Application.Features.Tasks.Commands;
using Worknest.Application.Features.Tasks.Queries;
using TaskStatus = Worknest.Domain.Entities.Task.TaskStatus;

namespace Worknest.Api.Controllers
{
    public class TaskController : BaseController
    {
        [HttpPost]
        [ProducesResponseType(typeof(ProjectTaskDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskCommand command)
        {
            return (await Mediator.Send(command))
                .Match(result => Ok(result), Problem);
        }

        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(ProjectTaskDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateTask([FromBody] UpdateTaskCommand command)
        {
            return (await Mediator.Send(command))
                .Match(Ok, Problem);
        }

        [HttpPut("{id:guid}/assign")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> AssignTask(Guid id, [FromBody] AssignTaskRequest request)
        {
            return (await Mediator.Send(new AssignTaskCommand(id, request.AssignedToEmployeeId)))
                .Match(_ => Ok(), Problem);
        }

        [HttpPut("{id:guid}/status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateTaskStatus(Guid id, [FromBody] UpdateTaskStatusRequest request)
        {
            return (await Mediator.Send(new UpdateTaskStatusCommand(id, request.Status)))
                .Match(_ => Ok(), Problem);
        }

        [HttpPut("{id:guid}/hours")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateTaskHours(Guid id, [FromBody] UpdateTaskHoursRequest request)
        {
            return (await Mediator.Send(new UpdateTaskHoursCommand(id, request.EstimatedHours, request.CompletedHours, request.RemainingHours)))
                .Match(_ => Ok(), Problem);
        }

        [HttpPost("{id:guid}/attachment")]
        [ProducesResponseType(typeof(UploadAttachmentResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddAttachment(Guid id, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is empty or not provided.");
            }

            using (var stream = file.OpenReadStream())
            {
                return (await Mediator.Send(new AddAttachmentToTaskCommand(id, stream, file.FileName)))
                    .Match(savedFileName => Ok(new UploadAttachmentResponse(savedFileName)), Problem);
            }
        }

        [HttpGet("{id:guid}/attachment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DownloadAttachment(Guid id)
        {
            return (await Mediator.Send(new GetTaskAttachmentQuery(id)))
                .Match(result => File(result.FileStream, result.ContentType, result.FileName), Problem);
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            return (await Mediator.Send(new DeleteTaskCommand(id)))
                .Match(_ => NoContent(), Problem);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(ProjectTaskDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTaskById(Guid id)
        {
            return (await Mediator.Send(new GetTaskByIdQuery(id)))
                .Match(Ok, Problem);
        }

        [HttpGet("project/{projectId:guid}")]
        [ProducesResponseType(typeof(List<ProjectTaskDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTasksByProjectId(Guid projectId)
        {
            return (await Mediator.Send(new GetTasksByProjectIdQuery(projectId)))
                .Match(Ok, Problem);
        }

        [HttpGet("employee/{employeeId:guid}")]
        [ProducesResponseType(typeof(List<ProjectTaskDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTasksAssignedToEmployee(Guid employeeId)
        {
            return (await Mediator.Send(new GetTasksAssignedToEmployeeQuery(employeeId)))
                .Match(Ok, Problem);
        }
    }

    public record AssignTaskRequest(Guid? AssignedToEmployeeId);
    public record UpdateTaskStatusRequest(TaskStatus Status);
    public record UpdateTaskHoursRequest(decimal? EstimatedHours, decimal CompletedHours, decimal? RemainingHours);
    public record UploadAttachmentResponse(string AttachmentUrl);
}
