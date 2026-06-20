using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Application.Repositories;
using Worknest.Domain.Entities.Employee;

namespace Worknest.Infrastructure.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly PrimaryDbContext _primaryDbContext;

        public EmployeeRepository(PrimaryDbContext primaryDbContext)
        {
            _primaryDbContext = primaryDbContext;
        }

        public async Task<Employee?> GetEmployeeByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _primaryDbContext.Employees
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        }

        public async Task<Worknest.Application.Common.PaginatedResponse<Employee>> GetAllEmployeesAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = _primaryDbContext.Employees;
            var totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
            
            return new Worknest.Application.Common.PaginatedResponse<Employee>(items, totalCount, pageNumber, pageSize);
        }

        public async Task AddEmployeeAsync(Employee employee, CancellationToken cancellationToken)
        {
            await _primaryDbContext.Employees.AddAsync(employee, cancellationToken);
        }

        public async Task DeleteEmployeeAsync(Guid id, CancellationToken cancellationToken)
        {
            var existingEmployee = await _primaryDbContext.Employees
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

            if (existingEmployee != null)
            {
                _primaryDbContext.Employees.Remove(existingEmployee);
            }
        }
    }
}
