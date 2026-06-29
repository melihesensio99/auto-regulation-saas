using MediatR;
using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.SubmitOnboardingForm;

public record SubmitOnboardingFormCommand(
    Guid AthleteId,
    DateTime DateOfBirth,
    string PhoneNumber,
    string Occupation,
    string MainReason,
    string ShortTermGoal,
    string LongTermGoal,
    string Expectations,
    double HeightCm,
    double StartingWeightKg,
    string TrainingHistory,
    string CurrentTrainingRoutine,
    string OutsidePhysicalActivity,
    string HasTrackedMacros,
    string HasWorkedWithCoach,
    string HearAboutUs,
    string AdditionalNotes
) : IRequest<Result<string>>;
