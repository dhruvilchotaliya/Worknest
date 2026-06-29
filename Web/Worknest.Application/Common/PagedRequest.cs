using ErrorOr;
using MediatR;

namespace Worknest.Application.Common;

public abstract record PagedRequest<TResponse> : IRequest<ErrorOr<PaginatedResponse<TResponse>>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}
