using MediatR;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Exceptions;
using Worknest.Application.Features.Tasks.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;
using Task = System.Threading.Tasks.Task;

using ErrorOr;

namespace Worknest.Infrastructure.Handlers.Tasks
{
    public class AddAttachmentToTaskCommandHandler : IRequestHandler<AddAttachmentToTaskCommand, ErrorOr<string>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProjectTaskRepository _projectTaskRepository;

        public AddAttachmentToTaskCommandHandler(IUnitOfWork unitOfWork, IProjectTaskRepository projectTaskRepository)
        {
            _unitOfWork = unitOfWork;
            _projectTaskRepository = projectTaskRepository;
        }

        public async Task<ErrorOr<string>> Handle(AddAttachmentToTaskCommand request, CancellationToken cancellationToken)
        {
            var task = await _projectTaskRepository.GetTaskByIdAsync(request.TaskId, cancellationToken);
            if (task == null)
            {
                return Error.NotFound("Task.NotFound", $"Task with ID {request.TaskId} was not found.");
            }

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Attachments");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // Delete old file if it exists
            if (!string.IsNullOrEmpty(task.AttachmentUrl))
            {
                var oldFilePath = Path.Combine(folderPath, task.AttachmentUrl);
                if (File.Exists(oldFilePath))
                {
                    try
                    {
                        File.Delete(oldFilePath);
                    }
                    catch
                    {
                        // Ignore file delete errors to prevent breaking the upload flow
                    }
                }
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{request.FileName}";
            var filePath = Path.Combine(folderPath, uniqueFileName);

            using (var writeStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                await request.FileStream.CopyToAsync(writeStream, cancellationToken);
            }

            task.AttachmentUrl = uniqueFileName;
            task.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return uniqueFileName;
        }
    }
}
