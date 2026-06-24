using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.SubmitOnboardingForm;

public record SubmitOnboardingFormRequestDto(
    DateTime DateOfBirth,
    double HeightCm,
    double StartingWeightKg,
    string InjuryHistory,
    string Goals,
    string Lifestyle,
    string SupplementUsage,
    string DietaryPreferences
);
