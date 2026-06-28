using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Dashboard.Queries.GetCoachDashboardSummary;

public class GetCoachDashboardSummaryQueryHandler : IRequestHandler<GetCoachDashboardSummaryQuery, Result<CoachDashboardDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetCoachDashboardSummaryQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CoachDashboardDto>> Handle(GetCoachDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var startOfWeek = GetStartOfWeek(today);
        var endExclusive = startOfWeek.AddDays(7);
        var todayExclusive = today.AddDays(1);

        var athletes = await _dbContext.Athletes
            .AsNoTracking()
            .Include(a => a.ProgressLogs.Where(pl => pl.Date >= startOfWeek && pl.Date < endExclusive))
            .Include(a => a.WorkoutExercises)
            .Include(a => a.DietMeals)
            .ToListAsync(cancellationToken);

        var athleteCards = athletes
            .Select(a => BuildAthleteCard(a, today, todayExclusive, startOfWeek))
            .ToList();

        var dto = new CoachDashboardDto(
            athletes.Count,
            athleteCards.Count(x => x.IsActiveToday),
            athleteCards.Count(x => x.NeedsAttention),
            athleteCards
        );

        return Result<CoachDashboardDto>.Success(dto);
    }

    private static AthletePerformanceDto BuildAthleteCard(
        SmartCoaching.Domain.Entities.Athlete athlete,
        DateTime today,
        DateTime todayExclusive,
        DateTime startOfWeek)
    {
        var weekLogs = athlete.ProgressLogs
            .Where(pl => pl.Date >= startOfWeek && pl.Date < todayExclusive)
            .OrderBy(pl => pl.Date)
            .ToList();

        var lastLogDate = weekLogs.LastOrDefault()?.Date;
        var hasWorkoutProgram = athlete.WorkoutExercises.Any();
        var hasDietProgram = athlete.DietMeals.Any();
        var isActiveToday = weekLogs.Any(pl => pl.Date.Date == today);

        var reasons = new List<string>();
        if (!isActiveToday)
        {
            reasons.Add("Bugün kayıt yok");
        }

        if (!hasWorkoutProgram)
        {
            reasons.Add("Antrenman programı eksik");
        }

        if (!hasDietProgram)
        {
            reasons.Add("Beslenme programı eksik");
        }

        return new AthletePerformanceDto
        {
            AthleteId = athlete.Id,
            FullName = $"{athlete.FirstName} {athlete.LastName}",
            IsActiveToday = isActiveToday,
            LastLogDate = lastLogDate,
            HasWorkoutProgram = hasWorkoutProgram,
            HasDietProgram = hasDietProgram,
            NeedsAttention = reasons.Count > 0,
            AttentionReason = reasons.Count == 0 ? null : string.Join(" · ", reasons)
        };
    }

    private static DateTime GetStartOfWeek(DateTime date)
    {
        var diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
        return date.AddDays(-diff);
    }
}
