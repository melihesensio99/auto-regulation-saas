using System;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthletes;

public record AthleteDto(
    Guid Id,
    string FirstName,
    string LastName,
    DateTime? DateOfBirth,
    decimal TargetCalories,
    int TargetSteps,
    bool IsOnboardingCompleted,
    string? PhoneNumber,
    string? Occupation,
    SmartCoaching.Domain.Enums.AthleteGoal? MainReason,
    string? ShortTermGoal,
    string? LongTermGoal,
    string? Expectations,
    double? HeightCm,
    double? StartingWeightKg,
    string? TrainingHistory,
    string? CurrentTrainingRoutine,
    string? OutsidePhysicalActivity,
    string? HasTrackedMacros,
    string? HasWorkedWithCoach,
    string? HearAboutUs,
    string? AdditionalNotes,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
