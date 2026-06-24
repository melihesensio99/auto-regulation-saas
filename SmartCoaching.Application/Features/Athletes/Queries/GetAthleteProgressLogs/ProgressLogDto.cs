using System;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteProgressLogs;

public record ProgressLogDto(
    Guid Id,
    DateTime Date,
    decimal ConsumedCalories,
    int TakenSteps,
    bool IsWorkoutCompleted,
    double? WeightKg,
    string? Notes,
    string? FrontPhotoUrl,
    string? BackPhotoUrl,
    string? SidePhotoUrl,
    string? CoachFeedback,
    string? AiAnalysis
);
