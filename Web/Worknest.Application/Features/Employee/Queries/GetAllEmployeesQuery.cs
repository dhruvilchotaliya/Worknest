using MediatR;
using Worknest.Application.Common;

namespace Worknest.Application.Features.Employee.Queries;

public record GetAllEmployeesQuery : PagedRequest<EmployeeDto>;

