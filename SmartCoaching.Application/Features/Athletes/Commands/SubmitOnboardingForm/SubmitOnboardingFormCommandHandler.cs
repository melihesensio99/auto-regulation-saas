using MassTransit;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Events;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Commands.SubmitOnboardingForm;

public class SubmitOnboardingFormCommandHandler : IRequestHandler<SubmitOnboardingFormCommand, Result<Unit>>
{
    private readonly IApplicationDbContext _context;
    private readonly IPublishEndpoint _publishEndpoint;

    public SubmitOnboardingFormCommandHandler(IApplicationDbContext context, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result<Unit>> Handle(SubmitOnboardingFormCommand request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes.FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);
        if (athlete == null)
        {
            return Result.Failure<Unit>(new Error("Athlete.NotFound", "Öğrenci bulunamadı.", ErrorType.NotFound));
        }

        if (athlete.IsOnboardingCompleted)
        {
            return Result.Failure<Unit>(new Error("Athlete.AlreadyOnboarded", "Tanışma formu zaten doldurulmuş.", ErrorType.Conflict));
        }

        athlete.CompleteOnboarding(
            request.DateOfBirth,
            request.PhoneNumber,
            request.Occupation,
            request.MainReason,
            request.ShortTermGoal,
            request.LongTermGoal,
            request.Expectations,
            request.HeightCm,
            request.StartingWeightKg,
            request.TrainingHistory,
            request.CurrentTrainingRoutine,
            request.OutsidePhysicalActivity,
            request.HasTrackedMacros,
            request.HasWorkedWithCoach,
            request.HearAboutUs,
            request.AdditionalNotes
        );

        await _context.SaveChangesAsync(cancellationToken);

        await _publishEndpoint.Publish(new OnboardingCompletedEvent
        {
            AthleteId = athlete.Id,
            CoachId = athlete.CoachId,
            AthleteFullName = $"{athlete.FirstName} {athlete.LastName}"
        }, cancellationToken);

        return Result.Success(Unit.Value);
    }
}
