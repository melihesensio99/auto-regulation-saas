using System;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetWorkoutProgram;

public record WorkoutExerciseResponseDto(
    Guid Id,
    string ExerciseName,
    int Sets,
    string Reps,
    int RestTimeInSeconds,
    string? Notes
);
