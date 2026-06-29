using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;

using ErrorOr;
using Task = System.Threading.Tasks.Task;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand, ErrorOr<Updated>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProjectRepository _projectRepository;

        public UpdateProjectCommandHandler(IUnitOfWork unitOfWork, IProjectRepository projectRepository)
        {
            _unitOfWork = unitOfWork;
            _projectRepository = projectRepository;
        }

        public async Task<ErrorOr<Updated>> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
        {
            var project = await _projectRepository.GetProjectByIdAsync(request.Id, cancellationToken);
            if (project == null)
            {
                return Error.NotFound("Project.NotFound", $"Project with ID {request.Id} was not found.");
            }

            project.Name = request.Name;
            project.Code = request.Code;
            project.Description = request.Description;
            project.ClientName = request.ClientName;
            project.StartedAt = request.StartedAt;
            project.EndedAt = request.EndedAt;
            project.TeamId = request.TeamId;
            project.IsActive = request.IsActive;

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Updated;
        }
    }
}
