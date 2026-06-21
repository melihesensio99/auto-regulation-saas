namespace SmartCoaching.Application.Features.Athletes.Commands.UpdateAthleteTargetsCommand;

public record UpdateAthleteTargetsRequestDto(
    decimal TargetCalories,
    int TargetSteps
);
