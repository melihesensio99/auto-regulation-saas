using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetWorkoutProgram;

public record AthleteWorkoutProgramDto(
    Guid AthleteId,
    List<WorkoutDayDto> Days
);

public record WorkoutDayDto(
    string DayName,
    List<WorkoutExerciseResponseDto> Exercises
);

public record WorkoutExerciseResponseDto(
    Guid Id,
    string ExerciseName,
    int Sets,
    string Reps,
    int RestTimeInSeconds,
    string? Notes
);
