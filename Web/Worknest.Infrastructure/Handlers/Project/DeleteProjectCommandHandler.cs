using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project.Commands;
using Worknest.Application.Repositories;

using ErrorOr;
using Task = System.Threading.Tasks.Task;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class DeleteProjectCommandHandler : IRequestHandler<DeleteProjectCommand, ErrorOr<Deleted>>
    {
        private readonly IProjectRepository _projectRepository;

        public DeleteProjectCommandHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<ErrorOr<Deleted>> Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
        {
            var project = await _projectRepository.GetProjectByIdAsync(request.Id, cancellationToken);
            if (project == null)
            {
                return Error.NotFound("Project.NotFound", $"Project with ID {request.Id} was not found.");
            }

            await _projectRepository.DeleteProjectAsync(request.Id, cancellationToken);
            return Result.Deleted;
        }
    }
}
