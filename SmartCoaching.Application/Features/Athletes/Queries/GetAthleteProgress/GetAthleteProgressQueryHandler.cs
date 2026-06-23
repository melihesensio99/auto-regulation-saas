using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteProgress;

public class GetAthleteProgressQueryHandler : IRequestHandler<GetAthleteProgressQuery, Result<List<DailyProgressDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAthleteProgressQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<DailyProgressDto>>> Handle(GetAthleteProgressQuery request, CancellationToken cancellationToken)
    {
        // Güvenlik Kalkanı: HasQueryFilter sayesinde bu sorgu sadece bizim sporcumuzsa TRUE döner.
        var athlete = await _context.Athletes
            .Where(a => a.Id == request.AthleteId)
            .Select(a => new { a.TargetCalories, a.TargetSteps })
            .FirstOrDefaultAsync(cancellationToken);

        if (athlete is null)
        {
            return Result.Failure<List<DailyProgressDto>>(new Error("Athlete.NotFound", "Sporcu bulunamadı veya bu sporcunun verilerini görmeye yetkiniz yok."));
        }

        var startDateUtc = DateTime.SpecifyKind(request.StartDate.Date, DateTimeKind.Utc);
        var endDateUtc = DateTime.SpecifyKind(request.EndDate.Date, DateTimeKind.Utc);

        var progresses = await _context.DailyProgresses
            .Where(p => p.AthleteId == request.AthleteId && p.Date >= startDateUtc && p.Date <= endDateUtc)
            .OrderByDescending(p => p.Date)
            .Select(p => new DailyProgressDto(
                p.Id,
                p.Date,
                p.ConsumedCalories,
                p.TakenSteps,
                athlete.TargetCalories,
                athlete.TargetSteps,
                p.ConsumedCalories <= athlete.TargetCalories, // <= because calorie target is usually a maximum, or if it's a minimum it's >=. Actually let's assume it's a limit or target, we can just say <= for now or just return the data. Let's use <=.
                p.TakenSteps >= athlete.TargetSteps,
                p.Notes
            ))
            .ToListAsync(cancellationToken);

        return Result.Success(progresses);
    }
}
