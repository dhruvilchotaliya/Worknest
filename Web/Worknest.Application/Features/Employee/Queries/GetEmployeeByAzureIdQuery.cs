using ErrorOr;
using MediatR;
using System;

namespace Worknest.Application.Features.Employee.Queries;

public record GetEmployeeByAzureIdQuery(Guid AzureObjectId) : IRequest<ErrorOr<EmployeeDto>>;
