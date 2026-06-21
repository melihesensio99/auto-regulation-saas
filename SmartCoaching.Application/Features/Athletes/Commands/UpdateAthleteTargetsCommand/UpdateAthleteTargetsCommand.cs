using MediatR;
using SmartCoaching.Domain.Common;
using System;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.UpdateAthleteTargetsCommand;

public record UpdateAthleteTargetsCommand(
    Guid AthleteId,
    decimal TargetCalories,
    int TargetSteps
) : IRequest<Result>;
