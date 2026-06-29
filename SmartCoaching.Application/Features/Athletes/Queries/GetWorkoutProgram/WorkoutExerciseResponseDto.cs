using System;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetWorkoutProgram;

public record WorkoutExerciseResponseDto(
    Guid Id,
    string DayName,
    string ExerciseName,
    int Sets,
    string Reps,
    int RestTimeInSeconds,
    string? Notes,
    string? ExerciseLibraryId,
    string? TargetMuscle,
    string? GifUrl,
    string? ImageUrl,
    string? Instructions
);
