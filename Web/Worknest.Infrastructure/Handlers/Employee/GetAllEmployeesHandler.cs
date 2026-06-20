using MediatR;
using Worknest.Application.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Queries;
using Worknest.Application.Repositories;
using Worknest.Infrastructure.Mappers;

namespace Worknest.Infrastructure.Handlers.Employee
{
    public class GetAllEmployeesHandler : IRequestHandler<GetAllEmployeesQuery, PaginatedResponse<EmployeeDto>>
    {
        private readonly IEmployeeRepository _employeeRepository;

        public GetAllEmployeesHandler(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<PaginatedResponse<EmployeeDto>> Handle(GetAllEmployeesQuery request, CancellationToken cancellationToken)
        {
            var pagedResult = await _employeeRepository.GetAllEmployeesAsync(request.PageNumber, request.PageSize, cancellationToken);
            
            var dtoList = pagedResult.Items.Select(e => EmployeeMapper.ToDto(e)).ToList();
            return new PaginatedResponse<EmployeeDto>(dtoList, pagedResult.TotalCount, request.PageNumber, request.PageSize);
        }
    }
}
