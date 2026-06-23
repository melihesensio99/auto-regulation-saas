using MediatR;
using SmartCoaching.Domain.Common;
using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteCheckIns;

public record GetAthleteCheckInsQuery(Guid AthleteId) : IRequest<Result<List<WeeklyCheckInDto>>>;

public record WeeklyCheckInDto(
    Guid Id,
    DateTime Date,
    decimal WeightKg,
    string? FrontPhotoUrl,
    string? BackPhotoUrl,
    string? SidePhotoUrl,
    string? CoachFeedback,
    string? AiAnalysis
);
