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
        var athleteExists = await _context.Athletes.AnyAsync(a => a.Id == request.AthleteId, cancellationToken);
        
        if (!athleteExists)
        {
            return Result.Failure<List<DailyProgressDto>>(new Error("Athlete.NotFound", "Sporcu bulunamadı veya bu sporcunun verilerini görmeye yetkiniz yok."));
        }

        var progresses = await _context.DailyProgresses
            .Where(p => p.AthleteId == request.AthleteId && p.Date >= request.StartDate.Date && p.Date <= request.EndDate.Date)
            .OrderByDescending(p => p.Date)
            .Select(p => new DailyProgressDto(
                p.Id,
                p.Date,
                p.ConsumedCalories,
                p.TakenSteps,
                p.Notes
            ))
            .ToListAsync(cancellationToken);

        return Result.Success(progresses);
    }
}
