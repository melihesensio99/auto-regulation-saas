using MediatR;
using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.LogProgressCommand;

public record LogProgressCommand(
    Guid AthleteId,
    DateTime Date,
    decimal ConsumedCalories,
    int TakenSteps,
    bool IsWorkoutCompleted,
    double? WeightKg,
    string? Notes,
    string? FrontPhotoUrl,
    string? BackPhotoUrl,
    string? SidePhotoUrl
) : IRequest<Result>;
