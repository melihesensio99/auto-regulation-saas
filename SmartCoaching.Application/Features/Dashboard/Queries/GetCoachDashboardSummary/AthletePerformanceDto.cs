using System;

namespace SmartCoaching.Application.Features.Dashboard.Queries.GetCoachDashboardSummary;

public class AthletePerformanceDto
{
    public Guid AthleteId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public double HeightCm { get; set; }
    public decimal WeeklyTargetCalories { get; set; }
    public decimal WeeklyConsumedCalories { get; set; }
    public bool IsMetCalorieTarget { get; set; }
    public int WeeklyTargetSteps { get; set; }
    public int WeeklyTakenSteps { get; set; }
    public bool IsMetStepTarget { get; set; }
    public decimal LatestWeightKg { get; set; }
    public string? LatestFrontPhotoUrl { get; set; }
    public bool IsSlacking { get; set; }
    public int RemainingSubscriptionDays { get; set; }
    public bool IsActiveToday { get; set; }
    public double WeeklyComplianceRatePercentage { get; set; }
    public decimal StartingWeightKg { get; set; }
}
