using Riok.Mapperly.Abstractions;
using Worknest.Application.Features.Employee;
using Worknest.Domain.Entities.Employee;

namespace Worknest.Infrastructure.Mappers
{
    [Mapper]
    public static partial class EmployeeMapper
    {
        public static partial EmployeeDto ToDto(Employee employee);
    }
}
