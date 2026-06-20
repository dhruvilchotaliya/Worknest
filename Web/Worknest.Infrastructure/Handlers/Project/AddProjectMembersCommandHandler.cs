using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project.Commands;
using Worknest.Application.Repositories;
using Worknest.Domain.Entities.Project;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class AddProjectMembersCommandHandler : IRequestHandler<AddProjectMembersCommand>
    {
        private readonly IProjectRepository _projectRepository;

        public AddProjectMembersCommandHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task Handle(AddProjectMembersCommand request, CancellationToken cancellationToken)
        {
            var projectMembers = request.EmployeeIds.Select(empId => new ProjectMember
            {
                Id = Guid.NewGuid(),
                ProjectId = request.ProjectId,
                EmployeeId = empId,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            await _projectRepository.AddProjectMembersAsync(projectMembers, cancellationToken);
        }
    }
}
