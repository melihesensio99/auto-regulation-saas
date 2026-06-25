using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetWorkoutProgram;

public record WorkoutDayDto(
    string DayName,
    List<WorkoutExerciseResponseDto> Exercises
);
