using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteProgressLogs;

public class GetAthleteProgressLogsQueryHandler : IRequestHandler<GetAthleteProgressLogsQuery, Result<List<ProgressLogDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAthleteProgressLogsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<ProgressLogDto>>> Handle(GetAthleteProgressLogsQuery request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes
            .Include(a => a.ProgressLogs.Where(pl => pl.Date >= request.StartDate.Date && pl.Date <= request.EndDate.Date))
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
        {
            return Result.Failure<List<ProgressLogDto>>(new Error("Athlete.NotFound", "Sporcu bulunamadı veya yetkiniz yok."));
        }

        var dtos = athlete.ProgressLogs
            .OrderByDescending(p => p.Date)
            .Select(p => new ProgressLogDto(
                p.Id,
                p.Date,
                p.ConsumedCalories,
                p.TakenSteps,
                p.IsWorkoutCompleted,
                p.WeightKg,
                p.Notes,
                p.FrontPhotoUrl,
                p.BackPhotoUrl,
                p.SidePhotoUrl,
                p.CoachFeedback,
                p.AiAnalysis
            )).ToList();

        return Result<List<ProgressLogDto>>.Success(dtos);
    }
}
