using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Tasks.Queries;

public record GetTaskAttachmentQuery(Guid TaskId) : IRequest<ErrorOr<AttachmentFileDto>>;
