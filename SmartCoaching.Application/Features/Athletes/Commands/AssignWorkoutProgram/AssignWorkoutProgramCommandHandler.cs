using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
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

    public AssignWorkoutProgramCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(AssignWorkoutProgramCommand request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes
            .Include(a => a.WorkoutExercises)
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
            return Result.Failure<Guid>(new Error("Athlete.NotFound", "Sporcu bulunamadı.", ErrorType.NotFound));

        var currentExercises = await _context.WorkoutExercises
            .AsNoTracking()
            .Where(x => x.AthleteId == athlete.Id)
            .OrderBy(x => x.OrderIndex)
            .Select(x => new
            {
                x.DayName,
                x.ExerciseName,
                x.Sets,
                x.Reps,
                x.RestTimeInSeconds,
                Notes = x.Notes ?? string.Empty,
                ExerciseLibraryId = x.ExerciseLibraryId ?? string.Empty
            })
            .ToListAsync(cancellationToken);

        var incomingExercises = request.Exercises
            .Select((e, index) => new
            {
                e.DayName,
                e.ExerciseName,
                e.Sets,
                e.Reps,
                e.RestTimeInSeconds,
                Notes = e.Notes ?? string.Empty,
                ExerciseLibraryId = e.ExerciseLibraryId ?? string.Empty,
                OrderIndex = index
            })
            .ToList();

        var isSameProgram =
            currentExercises.Count == incomingExercises.Count &&
            currentExercises.Zip(incomingExercises, (current, incoming) =>
                current.DayName == incoming.DayName &&
                current.ExerciseName == incoming.ExerciseName &&
                current.Sets == incoming.Sets &&
                current.Reps == incoming.Reps &&
                current.RestTimeInSeconds == incoming.RestTimeInSeconds &&
                current.Notes == incoming.Notes &&
                current.ExerciseLibraryId == incoming.ExerciseLibraryId).All(x => x);

        if (isSameProgram)
            return Result<Guid>.Success(athlete.Id);

        var newExercises = request.Exercises.Select((e, index) => new WorkoutExercise
        {
            AthleteId = athlete.Id,
            DayName = e.DayName,
            ExerciseName = e.ExerciseName,
            Sets = e.Sets,
            Reps = e.Reps,
            RestTimeInSeconds = e.RestTimeInSeconds,
            Notes = e.Notes,
            ExerciseLibraryId = e.ExerciseLibraryId,
            OrderIndex = index
        }).ToList();

        athlete.SetWorkoutExercises(newExercises);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(athlete.Id);
    }
}
