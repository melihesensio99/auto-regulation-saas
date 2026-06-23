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
            int athleteStepComplianceDays = 0;
            
            var progressDict = athlete.DailyProgresses.ToDictionary(dp => dp.Date.Date);
            
            for (var d = startOfWeek; d <= today; d = d.AddDays(1))
            {
                if (progressDict.TryGetValue(d, out var dp))
                {
                    if (dp.ConsumedCalories > 0 && dp.ConsumedCalories <= athlete.TargetCalories)
                        athleteComplianceDays++;
                    
                    if (dp.TakenSteps > 0 && dp.TakenSteps >= athlete.TargetSteps)
                        athleteStepComplianceDays++;
                }
            }

            decimal weeklyTargetCalories = athlete.TargetCalories * 7;
            decimal weeklyConsumedCalories = athlete.DailyProgresses.Sum(dp => dp.ConsumedCalories);
            int weeklyTargetSteps = athlete.TargetSteps * 7;
            int weeklyTakenSteps = athlete.DailyProgresses.Sum(dp => dp.TakenSteps);
            
            bool isMetCalorieTarget = daysElapsed > 0 && athleteComplianceDays == daysElapsed;
            bool isMetStepTarget = daysElapsed > 0 && athleteStepComplianceDays == daysElapsed;
            bool isSlacking = progressDict.Count < (daysElapsed / 2.0); // Veri girişi yarıdan azsa tembeldir
            bool isActiveToday = progressDict.ContainsKey(today);
            double athleteComplianceRate = daysElapsed == 0 ? 0 : Math.Round((double)athleteComplianceDays / daysElapsed * 100, 2);

            int remainingSubscriptionDays = (athlete.SubscriptionEndDate - DateTime.UtcNow.Date).Days;
            if (remainingSubscriptionDays < 0) remainingSubscriptionDays = 0;

            performances.Add(new AthletePerformanceDto
            {
                AthleteId = athlete.Id,
                FullName = $"{athlete.FirstName} {athlete.LastName}",
                HeightCm = athlete.HeightCm,
                WeeklyTargetCalories = weeklyTargetCalories,
                WeeklyConsumedCalories = weeklyConsumedCalories,
                IsMetCalorieTarget = isMetCalorieTarget,
                WeeklyTargetSteps = weeklyTargetSteps,
                WeeklyTakenSteps = weeklyTakenSteps,
                IsMetStepTarget = isMetStepTarget,
                LatestWeightKg = latestCheckIn?.WeightKg ?? 0,
                LatestFrontPhotoUrl = latestCheckIn?.FrontPhotoUrl,
                IsSlacking = isSlacking,
                RemainingSubscriptionDays = remainingSubscriptionDays,
                IsActiveToday = isActiveToday,
                WeeklyComplianceRatePercentage = athleteComplianceRate
            });
        }

        // 3. Yapay Zeka Analizi (Tekil İnceleme)
        var teamDataJson = System.Text.Json.JsonSerializer.Serialize(performances.Select(p => new {
            p.AthleteId,
            p.FullName,
            p.WeeklyTargetCalories,
            p.WeeklyConsumedCalories,
            p.WeeklyTargetSteps,
            p.WeeklyTakenSteps,
            p.IsSlacking
        }));

        string aiInsightJson = await _aiService.GenerateInsightAsync(teamDataJson, cancellationToken);
        
        try 
        {
            // Remove markdown code blocks if AI added them
            string cleanJson = aiInsightJson.Trim();
            if (cleanJson.StartsWith("```json")) cleanJson = cleanJson.Substring(7);
            if (cleanJson.StartsWith("```")) cleanJson = cleanJson.Substring(3);
            if (cleanJson.EndsWith("```")) cleanJson = cleanJson.Substring(0, cleanJson.Length - 3);
            cleanJson = cleanJson.Trim();

            var insights = System.Text.Json.JsonSerializer.Deserialize<System.Collections.Generic.Dictionary<Guid, string>>(cleanJson);
            if (insights != null)
            {
                foreach (var perf in performances)
                {
                    if (insights.TryGetValue(perf.AthleteId, out var insightText))
                    {
                        perf.AiInsight = insightText;
                    }
                }
            }
        }
        catch 
        {
            // AI JSON formatında dönmezse global olarak hata mesajı gösterebiliriz veya boş bırakabiliriz
        }

        var dto = new CoachDashboardDto(
            totalAthletes,
            dailyActiveAthletes,
            "Takımın yapay zeka analizleri tekil bazda listelenmiştir.",
            performances
        );

        return Result<CoachDashboardDto>.Success(dto);
    }
}
