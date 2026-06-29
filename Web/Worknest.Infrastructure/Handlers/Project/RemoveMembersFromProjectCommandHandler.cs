using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project.Commands;
using Worknest.Application.Repositories;

using ErrorOr;
using Task = System.Threading.Tasks.Task;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class RemoveMembersFromProjectCommandHandler : IRequestHandler<RemoveMembersFromProjectCommand, ErrorOr<Success>>
    {
        private readonly IProjectRepository _projectRepository;

        public RemoveMembersFromProjectCommandHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<ErrorOr<Success>> Handle(RemoveMembersFromProjectCommand request, CancellationToken cancellationToken)
        {
            var project = await _projectRepository.GetProjectByIdAsync(request.ProjectId, cancellationToken);
            if (project == null)
            {
                return Error.NotFound("Project.NotFound", $"Project with ID {request.ProjectId} was not found.");
            }

            await _projectRepository.RemoveMembersFromProject(request.EmployeeIds, cancellationToken);
            return Result.Success;
        }
    }
}
