using System;

namespace SmartCoaching.Application.Features.Dashboard.Queries.GetCoachDashboardSummary;

public class AthletePerformanceDto
{
    public Guid AthleteId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public bool IsActiveToday { get; set; }
    public DateTime? LastLogDate { get; set; }
    public bool HasWorkoutProgram { get; set; }
    public bool HasDietProgram { get; set; }
    public bool NeedsAttention { get; set; }
    public string? AttentionReason { get; set; }
}
