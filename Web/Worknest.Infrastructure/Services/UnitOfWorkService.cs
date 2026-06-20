using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Worknest.Application.Services;

namespace Worknest.Infrastructure.Services
{
    public class UnitOfWorkService : IUnitOfWork
    {
        public readonly PrimaryDbContext _primaryDbContext;
        public UnitOfWorkService(PrimaryDbContext primaryDbContext)
        {
            _primaryDbContext = primaryDbContext;
        }

        public void Dispose()
        {
            _primaryDbContext.Dispose();
        }

        public async ValueTask DisposeAsync()
        {
            await _primaryDbContext.DisposeAsync();
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _primaryDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
