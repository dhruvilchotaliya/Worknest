using ErrorOr;
using MediatR;

namespace Worknest.Application.Features.Employee.Queries
{
    public record GetMyProfileQuery : IRequest<ErrorOr<CurrentUserContextDto>>;
}
