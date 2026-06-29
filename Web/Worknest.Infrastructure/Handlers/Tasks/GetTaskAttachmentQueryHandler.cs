using MediatR;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Exceptions;
using Worknest.Application.Features.Tasks;
using Worknest.Application.Features.Tasks.Queries;
using Worknest.Application.Repositories;
using Task = System.Threading.Tasks.Task;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Tasks
{
    public class GetTaskAttachmentQueryHandler : IRequestHandler<GetTaskAttachmentQuery, ErrorOr<AttachmentFileDto>>
    {
        private readonly IProjectTaskRepository _projectTaskRepository;

        public GetTaskAttachmentQueryHandler(IProjectTaskRepository projectTaskRepository)
        {
            _projectTaskRepository = projectTaskRepository;
        }

        public async Task<ErrorOr<AttachmentFileDto>> Handle(GetTaskAttachmentQuery request, CancellationToken cancellationToken)
        {
            var task = await _projectTaskRepository.GetTaskByIdAsync(request.TaskId, cancellationToken);
            if (task == null)
            {
                return Error.NotFound("Task.NotFound", $"Task with ID {request.TaskId} was not found.");
            }

            if (string.IsNullOrEmpty(task.AttachmentUrl))
            {
                return Error.NotFound("Task.AttachmentNotFound", $"Task with ID {request.TaskId} has no attachment.");
            }

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Attachments");
            var filePath = Path.Combine(folderPath, task.AttachmentUrl);

            if (!File.Exists(filePath))
            {
                return Error.NotFound("Task.AttachmentFileNotFound", $"Attachment file {task.AttachmentUrl} was not found on disk.");
            }

            // Extract original file name from Guid_FileName format
            string originalFileName = task.AttachmentUrl;
            if (task.AttachmentUrl.Length > 37 && task.AttachmentUrl[36] == '_')
            {
                originalFileName = task.AttachmentUrl.Substring(37);
            }

            // Determine content type based on file extension
            var contentType = "application/octet-stream";
            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            switch (extension)
            {
                case ".pdf": contentType = "application/pdf"; break;
                case ".png": contentType = "image/png"; break;
                case ".jpg": case ".jpeg": contentType = "image/jpeg"; break;
                case ".gif": contentType = "image/gif"; break;
                case ".txt": contentType = "text/plain"; break;
                case ".zip": contentType = "application/zip"; break;
                case ".xls": case ".xlsx": contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; break;
                case ".doc": case ".docx": contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; break;
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);

            return new AttachmentFileDto
            {
                FileStream = fileStream,
                FileName = originalFileName,
                ContentType = contentType
            };
        }
    }
}
