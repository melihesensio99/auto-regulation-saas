using MediatR;
using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.SubmitOnboardingForm;

public record SubmitOnboardingFormCommand(
    Guid AthleteId,
    DateTime DateOfBirth,
    double HeightCm,
    double StartingWeightKg,
    string InjuryHistory,
    string Goals,
    string Lifestyle,
    string SupplementUsage,
    string DietaryPreferences
) : IRequest<Result<Unit>>;
