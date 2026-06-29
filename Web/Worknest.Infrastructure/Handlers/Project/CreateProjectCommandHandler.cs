using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Project;
using Worknest.Application.Features.Project.Commands;
using Worknest.Application.Repositories;
using Worknest.Application.Services;
using Worknest.Infrastructure.Mappers;

using ErrorOr;
using Task = System.Threading.Tasks.Task;

namespace Worknest.Infrastructure.Handlers.Project
{
    public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, ErrorOr<ProjectDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProjectRepository _projectRepository;

        public CreateProjectCommandHandler(IUnitOfWork unitOfWork, IProjectRepository projectRepository)
        {
            _unitOfWork = unitOfWork;
            _projectRepository = projectRepository;
        }

        public async Task<ErrorOr<ProjectDto>> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
        {
            var project = new Worknest.Domain.Entities.Project.Project
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Code = request.Code,
                Description = request.Description,
                ClientName = request.ClientName,
                StartedAt = request.StartedAt,
                EndedAt = request.EndedAt,
                TeamId = request.TeamId,
                CreatedAt = DateTime.UtcNow
            };

            await _projectRepository.CreateProjectAsync(project, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return ProjectMapper.ToDto(project);
        }
    }
}
