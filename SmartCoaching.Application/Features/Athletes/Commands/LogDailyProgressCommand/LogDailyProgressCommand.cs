using MediatR;
using SmartCoaching.Domain.Common;
using System;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.LogDailyProgressCommand;

public record LogDailyProgressCommand(
    Guid AthleteId,
    DateTime Date,
    decimal ConsumedCalories,
    int TakenSteps,
    string? Notes
) : IRequest<Result>;
