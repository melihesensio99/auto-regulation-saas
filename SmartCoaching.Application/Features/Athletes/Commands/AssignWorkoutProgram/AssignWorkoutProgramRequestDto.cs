using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignWorkoutProgram;

public record AssignWorkoutProgramRequestDto(
    List<WorkoutExerciseDto> Exercises
);

