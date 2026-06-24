using MassTransit;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Events;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Services;

public static class ProgramNotificationHelper
{
    public static async Task CheckAndSendProgramPublishedEventAsync(
        Athlete athlete,
        IApplicationDbContext context,
        IPublishEndpoint publishEndpoint,
        CancellationToken cancellationToken)
    {
        var hasWorkoutProgram = await context.WorkoutExercises.AnyAsync(m => m.AthleteId == athlete.Id, cancellationToken);
        var hasDietProgram = await context.DietMeals.AnyAsync(m => m.AthleteId == athlete.Id, cancellationToken);

        bool cooldownPassed = !athlete.LastProgramNotificationSentAt.HasValue || 
                              (DateTime.UtcNow - athlete.LastProgramNotificationSentAt.Value).TotalHours > 12;

        if (hasWorkoutProgram && hasDietProgram && cooldownPassed)
        {
            athlete.MarkProgramNotificationSent();
            await context.SaveChangesAsync(cancellationToken);

            await publishEndpoint.Publish(new ProgramPublishedEvent
            {
                AthleteId = athlete.Id,
                AthleteEmail = athlete.Email,
                AthleteFullName = $"{athlete.FirstName} {athlete.LastName}"
            }, cancellationToken);
        }
    }
}
