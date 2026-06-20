using System;
using System.Collections.Generic;
using System.Text;

namespace Worknest.Application.Services
{
    public interface IUnitOfWork : IDisposable
    {
        /// <summary>
        /// Save changes asynchronously
        /// </summary>
        /// <param name="cancellationToken">The <see cref="CancellationToken"/></param>
        /// <returns>A <see cref="Task"/> of the total changes</returns>
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
