using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Employee.Commands
{
    public record ChangeEmployeeRoleCommand(
        Guid EmployeeId,
        string NewRoleName) : IRequest<ErrorOr<Success>>;
}
