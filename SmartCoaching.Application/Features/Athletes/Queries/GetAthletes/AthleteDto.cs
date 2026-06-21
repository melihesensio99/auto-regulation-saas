using System;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthletes;

public record AthleteDto(
    Guid Id,
    string FirstName,
    string LastName,
    DateTime DateOfBirth,
    decimal TargetCalories,
    int TargetSteps,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
