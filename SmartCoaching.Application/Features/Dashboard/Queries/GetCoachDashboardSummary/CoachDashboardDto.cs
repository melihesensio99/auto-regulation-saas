using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Dashboard.Queries.GetCoachDashboardSummary;

public record CoachDashboardDto(
    int TotalAthletes,
    int DailyActiveAthletes,
    double WeeklyComplianceRatePercentage,
    string AiInsight,
    List<AthletePerformanceDto> AthletePerformances
);
