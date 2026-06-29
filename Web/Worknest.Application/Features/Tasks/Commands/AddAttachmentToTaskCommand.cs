using ErrorOr;
using MediatR;
using System;
using System.IO;

namespace Worknest.Application.Features.Tasks.Commands;

public record AddAttachmentToTaskCommand(
    Guid TaskId,
    Stream FileStream,
    string FileName) : IRequest<ErrorOr<string>>;
