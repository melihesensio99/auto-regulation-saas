using Microsoft.EntityFrameworkCore;
using SmartCoaching.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Coach> Coaches { get; }
    DbSet<Athlete> Athletes { get; }
    DbSet<DailyMetric> DailyMetrics { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
