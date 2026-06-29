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

        var athleteBasics = await _dbContext.Athletes
            .AsNoTracking()
            .Select(a => new AthleteDashboardRow(
                a.Id,
                a.FirstName,
                a.LastName))
            .ToListAsync(cancellationToken);

        var athleteIds = athleteBasics.Select(a => a.AthleteId).ToList();

        var weekProgressLogs = await _dbContext.ProgressLogs
            .AsNoTracking()
            .Where(pl => athleteIds.Contains(pl.AthleteId) && pl.Date >= startOfWeek && pl.Date < endExclusive)
            .Select(pl => new ProgressLogRow(pl.AthleteId, pl.Date))
            .ToListAsync(cancellationToken);

        var workoutAthleteIds = await _dbContext.WorkoutExercises
            .AsNoTracking()
            .Where(w => athleteIds.Contains(w.AthleteId))
            .Select(w => w.AthleteId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var dietAthleteIds = await _dbContext.DietMeals
            .AsNoTracking()
            .Where(d => athleteIds.Contains(d.AthleteId))
            .Select(d => d.AthleteId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var athleteCards = athleteBasics
            .Select(a => BuildAthleteCard(
                a,
                weekProgressLogs.Where(pl => pl.AthleteId == a.AthleteId).ToList(),
                workoutAthleteIds.Contains(a.AthleteId),
                dietAthleteIds.Contains(a.AthleteId),
                today,
                todayExclusive))
            .ToList();

        var dto = new CoachDashboardDto(
            athleteBasics.Count,
            athleteCards.Count(x => x.IsActiveToday),
            athleteCards.Count(x => x.NeedsAttention),
            athleteCards
        );

        return Result<CoachDashboardDto>.Success(dto);
    }

    private static AthletePerformanceDto BuildAthleteCard(
        AthleteDashboardRow athlete,
        List<ProgressLogRow> weekLogs,
        bool hasWorkoutProgram,
        bool hasDietProgram,
        DateTime today,
        DateTime todayExclusive)
    {
        var orderedWeekLogs = weekLogs
            .Where(pl => pl.Date < todayExclusive)
            .OrderBy(pl => pl.Date)
            .ToList();

        var lastLogDate = orderedWeekLogs.LastOrDefault()?.Date;
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
            AthleteId = athlete.AthleteId,
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

    private sealed record AthleteDashboardRow(Guid AthleteId, string FirstName, string LastName);

    private sealed record ProgressLogRow(Guid AthleteId, DateTime Date);
}
