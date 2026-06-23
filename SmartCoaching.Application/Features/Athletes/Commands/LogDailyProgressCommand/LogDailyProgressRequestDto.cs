using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.LogDailyProgressCommand;

public record LogDailyProgressRequestDto(
    DateTime Date,
    decimal ConsumedCalories,
    int TakenSteps,
    double? WeightKg,
    bool IsWorkoutCompleted,
    string Notes
);
