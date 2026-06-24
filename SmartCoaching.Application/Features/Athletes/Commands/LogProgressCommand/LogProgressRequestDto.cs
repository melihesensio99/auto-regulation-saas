using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.LogProgressCommand;

public record LogProgressRequestDto(
    DateTime Date,
    decimal ConsumedCalories,
    int TakenSteps,
    bool IsWorkoutCompleted,
    double? WeightKg,
    string? Notes,
    string? FrontPhotoUrl,
    string? BackPhotoUrl,
    string? SidePhotoUrl
);
