using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Employee.Queries;

public record GetEmployeeByIdQuery(Guid Id) : IRequest<ErrorOr<EmployeeDto>>;
