using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project.Commands;
using Worknest.Application.Repositories;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class RemoveMembersFromProjectCommandHandler : IRequestHandler<RemoveMembersFromProjectCommand>
    {
        private readonly IProjectRepository _projectRepository;

        public RemoveMembersFromProjectCommandHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task Handle(RemoveMembersFromProjectCommand request, CancellationToken cancellationToken)
        {
            await _projectRepository.RemoveMembersFromProject(request.EmployeeIds, cancellationToken);
        }
    }
}
