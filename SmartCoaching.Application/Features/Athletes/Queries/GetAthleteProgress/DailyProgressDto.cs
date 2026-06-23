using System;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteProgress;

public record DailyProgressDto(
    Guid Id,
    DateTime Date,
    decimal ConsumedCalories,
    int TakenSteps,
    decimal TargetCalories,
    int TargetSteps,
    bool IsCalorieTargetMet,
    bool IsStepTargetMet,
    string? Notes
);
