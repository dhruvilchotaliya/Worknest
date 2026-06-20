using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project.Commands;
using Worknest.Application.Repositories;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class DeleteProjectCommandHandler : IRequestHandler<DeleteProjectCommand>
    {
        private readonly IProjectRepository _projectRepository;

        public DeleteProjectCommandHandler(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
        {
            await _projectRepository.DeleteProjectAsync(request.Id, cancellationToken);
        }
    }
}
