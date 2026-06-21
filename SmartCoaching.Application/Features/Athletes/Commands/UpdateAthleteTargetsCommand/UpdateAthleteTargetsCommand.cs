using MediatR;
using SmartCoaching.Domain.Common;
using System;
using System.Text.Json.Serialization;

namespace SmartCoaching.Application.Features.Athletes.Commands.UpdateAthleteTargetsCommand;

public record UpdateAthleteTargetsCommand(
    [property: JsonIgnore] Guid AthleteId, // Bu ID URL'den gelecek, JSON'dan değil!
    decimal TargetCalories,
    int TargetSteps
) : IRequest<Result>;
