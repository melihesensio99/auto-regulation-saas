using System;
using MediatR;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Application.Features.Athletes.Commands.SubmitWeeklyCheckInCommand;

public record SubmitWeeklyCheckInCommand(
    Guid AthleteId,
    DateTime Date,
    decimal WeightKg,
    string? FrontPhotoUrl,
    string? BackPhotoUrl,
    string? SidePhotoUrl
) : IRequest<Result>;
