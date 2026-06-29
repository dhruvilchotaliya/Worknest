using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Domain.Entities.Employee;

namespace Worknest.Application.Repositories
{
    public interface IEmployeeRepository
    {
        Task<Employee?> GetEmployeeByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<Employee?> GetEmployeeByAzureObjectIdAsync(Guid azureObjectId, CancellationToken cancellationToken);
        Task<Worknest.Application.Common.PaginatedResponse<Employee>> GetAllEmployeesAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task AddEmployeeAsync(Employee employee, CancellationToken cancellationToken);
        Task DeleteEmployeeAsync(Guid id, CancellationToken cancellationToken);
    }
}
