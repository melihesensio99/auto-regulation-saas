using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Dashboard.Queries.GetCoachDashboardSummary;

public class GetCoachDashboardSummaryQueryHandler : IRequestHandler<GetCoachDashboardSummaryQuery, Result<CoachDashboardDto>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IAiService _aiService;

    public GetCoachDashboardSummaryQueryHandler(IApplicationDbContext dbContext, IAiService aiService)
    {
        _dbContext = dbContext;
        _aiService = aiService;
    }

    public async Task<Result<CoachDashboardDto>> Handle(GetCoachDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        // 1. O haftanın Pazartesi gününü bul
        var today = DateTime.UtcNow.Date;
        int diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
        var startOfWeek = today.AddDays(-1 * diff).Date; // O haftanın Pazartesisi
        var endOfWeek = startOfWeek.AddDays(6).Date;     // O haftanın Pazarı

        // 2. Global Query Filter sayesinde sadece bu antrenörün sporcuları gelir.
        var athletes = await _dbContext.Athletes
            .Include(a => a.DailyProgresses.Where(dp => dp.Date >= startOfWeek && dp.Date <= endOfWeek))
            .Include(a => a.WeeklyCheckIns.Where(w => w.Date >= startOfWeek && w.Date <= endOfWeek).OrderByDescending(w => w.Date).Take(1))
            .ToListAsync(cancellationToken);

        int totalAthletes = athletes.Count;
        int dailyActiveAthletes = athletes.Count(a => a.DailyProgresses.Any(dp => dp.Date.Date == today));

        var performances = new System.Collections.Generic.List<AthletePerformanceDto>();
        int totalComplianceDays = 0;
        int totalExpectedDays = 0;

        foreach (var athlete in athletes)
        {
            var latestCheckIn = athlete.WeeklyCheckIns.FirstOrDefault();
            
            int daysElapsed = (int)(today - startOfWeek).TotalDays + 1;
            int athleteComplianceDays = 0;
            
            var progressDict = athlete.DailyProgresses.ToDictionary(dp => dp.Date.Date);
            
            for (var d = startOfWeek; d <= today; d = d.AddDays(1))
            {
                if (progressDict.TryGetValue(d, out var dp))
                {
                    if (dp.ConsumedCalories > 0 && dp.ConsumedCalories <= athlete.TargetCalories)
                    {
                        athleteComplianceDays++;
                    }
                }
            }

            totalExpectedDays += daysElapsed;
            totalComplianceDays += athleteComplianceDays;

            decimal weeklyTargetCalories = athlete.TargetCalories * 7;
            decimal weeklyConsumedCalories = athlete.DailyProgresses.Sum(dp => dp.ConsumedCalories);
            
            bool isMetCalorieTarget = daysElapsed > 0 && athleteComplianceDays == daysElapsed;
            bool isSlacking = progressDict.Count < (daysElapsed / 2.0); // Veri girişi yarıdan azsa tembeldir

            int remainingSubscriptionDays = (athlete.SubscriptionEndDate - DateTime.UtcNow.Date).Days;
            if (remainingSubscriptionDays < 0) remainingSubscriptionDays = 0;

            performances.Add(new AthletePerformanceDto(
                athlete.Id,
                $"{athlete.FirstName} {athlete.LastName}",
                athlete.HeightCm,
                weeklyTargetCalories,
                weeklyConsumedCalories,
                isMetCalorieTarget,
                latestCheckIn?.WeightKg ?? 0,
                latestCheckIn?.FrontPhotoUrl,
                isSlacking,
                remainingSubscriptionDays
            ));
        }

        double complianceRate = totalExpectedDays == 0 ? 0 : Math.Round((double)totalComplianceDays / totalExpectedDays * 100, 2);

        // 3. Yapay Zeka Analizi
        var teamDataJson = System.Text.Json.JsonSerializer.Serialize(new
        {
            TotalAthletes = totalAthletes,
            WeeklyComplianceRate = complianceRate,
            Performances = performances
        });

        string aiInsight = await _aiService.GenerateInsightAsync(teamDataJson, cancellationToken);

        var dto = new CoachDashboardDto(
            totalAthletes,
            dailyActiveAthletes,
            complianceRate,
            aiInsight,
            performances
        );

        return Result<CoachDashboardDto>.Success(dto);
    }
}
