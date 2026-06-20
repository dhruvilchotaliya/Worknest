using MediatR;
using System;

namespace Worknest.Application.Features.Project.Commands;

public record DeleteProjectCommand(Guid Id) : IRequest;

