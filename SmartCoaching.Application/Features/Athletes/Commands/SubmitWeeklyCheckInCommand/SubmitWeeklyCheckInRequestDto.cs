using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.SubmitWeeklyCheckInCommand;

public record SubmitWeeklyCheckInRequestDto(
    DateTime Date,
    decimal WeightKg,
    string? FrontPhotoUrl,
    string? BackPhotoUrl,
    string? SidePhotoUrl
);
