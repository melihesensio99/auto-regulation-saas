using System;

namespace SmartCoaching.Application.Features.Dashboard.Queries.GetCoachDashboardSummary;

public record AthletePerformanceDto(
    Guid AthleteId,
    string FullName,
    int HeightCm,
    decimal WeeklyTargetCalories,
    decimal WeeklyConsumedCalories,
    bool IsMetCalorieTarget,
    decimal LatestWeightKg,
    string? LatestFrontPhotoUrl,
    bool IsSlacking // Veri girmediyse veya hedeften çok saptıysa
);
