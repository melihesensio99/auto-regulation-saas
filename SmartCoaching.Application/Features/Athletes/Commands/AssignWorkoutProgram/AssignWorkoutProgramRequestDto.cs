using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignWorkoutProgram;

public record AssignWorkoutProgramRequestDto(
    List<WorkoutExerciseDto> Exercises
);

public record WorkoutExerciseDto(
    string DayName,
    string ExerciseName,
    int Sets,
    string Reps,
    int RestTimeInSeconds,
    string? Notes
);
