using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetWorkoutProgram;

public class GetAthleteWorkoutProgramQueryHandler : IRequestHandler<GetAthleteWorkoutProgramQuery, Result<AthleteWorkoutProgramDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAthleteWorkoutProgramQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<AthleteWorkoutProgramDto>> Handle(GetAthleteWorkoutProgramQuery request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes
            .Include(a => a.WorkoutExercises)
                .ThenInclude(we => we.ExerciseLibrary)
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
            return Result.Failure<AthleteWorkoutProgramDto>(new Error("Athlete.NotFound", "Sporcu bulunamadı.", ErrorType.NotFound));

        var exercises = athlete.WorkoutExercises
            .OrderBy(we => we.OrderIndex)
            .Select(x => new WorkoutExerciseResponseDto(
                Id: x.Id,
                DayName: x.DayName,
                ExerciseName: x.ExerciseName,
                Sets: x.Sets,
                Reps: x.Reps,
                RestTimeInSeconds: x.RestTimeInSeconds,
                Notes: x.Notes,
                ExerciseLibraryId: x.ExerciseLibraryId,
                TargetMuscle: x.ExerciseLibrary?.TargetMuscle,
                GifUrl: x.ExerciseLibrary?.VideoUrl,
                ImageUrl: x.ExerciseLibrary?.ImageUrl,
                Instructions: x.ExerciseLibrary?.InstructionsTr
            ))
            .ToList();

        var response = new AthleteWorkoutProgramDto(
            AthleteId: request.AthleteId,
            Exercises: exercises
        );

        return Result<AthleteWorkoutProgramDto>.Success(response);
    }
}
