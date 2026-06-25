using MassTransit;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Events;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Features.Athletes.Services;
using SmartCoaching.Domain.Common;
using SmartCoaching.Domain.Entities;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignWorkoutProgram;

public class AssignWorkoutProgramCommandHandler : IRequestHandler<AssignWorkoutProgramCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly IPublishEndpoint _publishEndpoint;

    public AssignWorkoutProgramCommandHandler(IApplicationDbContext context, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result<Guid>> Handle(AssignWorkoutProgramCommand request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
            return Result.Failure<Guid>(new Error("Athlete.NotFound", "Sporcu bulunamadı.", ErrorType.NotFound));

        // Create new exercise list (Sıralamayı OrderIndex olarak kaydet)
        var newExercises = request.Exercises.Select((e, index) => new WorkoutExercise
        {
            DayName = e.DayName,
            ExerciseName = e.ExerciseName,
            Sets = e.Sets,
            Reps = e.Reps,
            RestTimeInSeconds = e.RestTimeInSeconds,
            Notes = e.Notes,
            OrderIndex = index
        }).ToList();

        // JSON dizisi olarak sporcuya ata
        athlete.SetWorkoutExercises(newExercises);

        // Save changes
        await _context.SaveChangesAsync(cancellationToken);

        // Auto Notification Logic (Refactored to Helper)
        if (newExercises.Any())
        {
            await ProgramNotificationHelper.CheckAndSendProgramPublishedEventAsync(athlete, _context, _publishEndpoint, cancellationToken);
        }

        return Result<Guid>.Success(athlete.Id);
    }
}
