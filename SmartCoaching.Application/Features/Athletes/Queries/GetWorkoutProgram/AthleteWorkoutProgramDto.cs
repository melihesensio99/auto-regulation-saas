using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetWorkoutProgram;

public record AthleteWorkoutProgramDto(
    Guid AthleteId,
    List<WorkoutExerciseResponseDto> Exercises
);
