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

    public GetCoachDashboardSummaryQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CoachDashboardDto>> Handle(GetCoachDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        // 1. Son 7 günün aralığını bul
        var today = DateTime.UtcNow.Date;
        var sevenDaysAgo = today.AddDays(-7);

        // 2. Global Query Filter sayesinde sadece bu antrenörün sporcuları gelir.
        var athletes = await _dbContext.Athletes
            .Include(a => a.DailyProgresses.Where(dp => dp.Date >= sevenDaysAgo))
            .Include(a => a.WeeklyCheckIns.OrderByDescending(w => w.Date).Take(1))
            .ToListAsync(cancellationToken);

        int totalAthletes = athletes.Count;
        int dailyActiveAthletes = athletes.Count(a => a.DailyProgresses.Any(dp => dp.Date.Date == today));

        var performances = new System.Collections.Generic.List<AthletePerformanceDto>();
        int totalComplianceDays = 0;
        int totalExpectedDays = totalAthletes * 7;

        foreach (var athlete in athletes)
        {
            var latestCheckIn = athlete.WeeklyCheckIns.FirstOrDefault();
            
            // Haftalık hedefler (örneğin günlük hedef * 7)
            decimal weeklyTargetCalories = athlete.TargetCalories * 7;
            decimal weeklyConsumedCalories = athlete.DailyProgresses.Sum(dp => dp.ConsumedCalories);
            
            bool isMetCalorieTarget = weeklyConsumedCalories > 0 && weeklyConsumedCalories <= weeklyTargetCalories;
            bool isSlacking = !athlete.DailyProgresses.Any(); // Eğer hiç veri girmediyse tembeldir

            if (isMetCalorieTarget) totalComplianceDays += 7; // Basitleştirilmiş hesaplama

            performances.Add(new AthletePerformanceDto(
                athlete.Id,
                $"{athlete.FirstName} {athlete.LastName}",
                athlete.HeightCm,
                weeklyTargetCalories,
                weeklyConsumedCalories,
                isMetCalorieTarget,
                latestCheckIn?.WeightKg ?? 0,
                latestCheckIn?.FrontPhotoUrl,
                isSlacking
            ));
        }

        double complianceRate = totalExpectedDays == 0 ? 0 : Math.Round((double)totalComplianceDays / totalExpectedDays * 100, 2);

        // AI Insight Placeholder (Gelecekte LLM servisi ile burası dolacak)
        string aiInsight = "Takımınız hafta sonları kalori hedeflerini %40 oranında aşıyor. Hafta sonu için daha esnek bir diyet planı düşünebilirsiniz.";

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
