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
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
            return Result.Failure<Guid>(new Error("Athlete.NotFound", "Sporcu bulunamadı.", ErrorType.NotFound));

        // Veritabanındaki eski egzersizleri bul ve sil
        var oldExercises = await _context.WorkoutExercises
            .Where(e => e.AthleteId == request.AthleteId)
            .ToListAsync(cancellationToken);

        if (oldExercises.Any())
        {
            _context.WorkoutExercises.RemoveRange(oldExercises);
        }

        // Create new exercise list (Sıralamayı OrderIndex olarak kaydet)
        var newExercises = request.Exercises.Select((e, index) => new WorkoutExercise
        {
            AthleteId = athlete.Id,
            Athlete = athlete,
            DayName = e.DayName,
            ExerciseName = e.ExerciseName,
            Sets = e.Sets,
            Reps = e.Reps,
            RestTimeInSeconds = e.RestTimeInSeconds,
            Notes = e.Notes,
            OrderIndex = index
        }).ToList();

        // Yeni egzersizleri veritabanına ekle
        await _context.WorkoutExercises.AddRangeAsync(newExercises, cancellationToken);

        // Save changes
        await _context.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(athlete.Id);
    }
}
