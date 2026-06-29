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

public class SubmitOnboardingFormCommandHandler : IRequestHandler<SubmitOnboardingFormCommand, Result<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IJwtProvider _jwtProvider;

    public SubmitOnboardingFormCommandHandler(
        IApplicationDbContext context,
        IPublishEndpoint publishEndpoint,
        IJwtProvider jwtProvider)
    {
        _context = context;
        _publishEndpoint = publishEndpoint;
        _jwtProvider = jwtProvider;
    }

    public async Task<Result<string>> Handle(SubmitOnboardingFormCommand request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes.FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);
        if (athlete == null)
        {
            return Result.Failure<string>(new Error("Athlete.NotFound", "Öğrenci bulunamadı.", ErrorType.NotFound));
        }

        if (athlete.IsOnboardingCompleted)
        {
            return Result.Failure<string>(new Error("Athlete.AlreadyOnboarded", "Tanışma formu zaten doldurulmuş.", ErrorType.Conflict));
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

        var refreshedToken = _jwtProvider.GenerateForAthlete(athlete);
        return Result.Success(refreshedToken);
    }
}
