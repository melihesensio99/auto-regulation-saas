namespace SmartCoaching.Application.Features.Athletes.Commands.AssignWorkoutProgram;

public record WorkoutExerciseDto(
    string DayName,
    string ExerciseName,
    int Sets,
    string Reps,
    int RestTimeInSeconds,
    string? Notes
);
