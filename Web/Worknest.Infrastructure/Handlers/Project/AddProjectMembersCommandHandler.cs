using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project.Commands;
using Worknest.Application.Repositories;
using Worknest.Domain.Entities.Project;

using ErrorOr;
using Task = System.Threading.Tasks.Task;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class AddProjectMembersCommandHandler : IRequestHandler<AddProjectMembersCommand, ErrorOr<Success>>
    {
        private readonly IProjectRepository _projectRepository;

        public AddProjectMembersCommandHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<ErrorOr<Success>> Handle(AddProjectMembersCommand request, CancellationToken cancellationToken)
        {
            var project = await _projectRepository.GetProjectByIdAsync(request.ProjectId, cancellationToken);
            if (project == null)
            {
                return Error.NotFound("Project.NotFound", $"Project with ID {request.ProjectId} was not found.");
            }

            var projectMembers = request.EmployeeIds.Select(empId => new ProjectMember
            {
                Id = Guid.NewGuid(),
                ProjectId = request.ProjectId,
                EmployeeId = empId,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            await _projectRepository.AddProjectMembersAsync(projectMembers, cancellationToken);
            return Result.Success;
        }
    }
}
