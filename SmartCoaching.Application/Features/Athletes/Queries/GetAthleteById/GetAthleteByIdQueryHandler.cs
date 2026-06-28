using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Features.Athletes.Queries.GetAthletes;
using SmartCoaching.Domain.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteById;

public class GetAthleteByIdQueryHandler : IRequestHandler<GetAthleteByIdQuery, Result<AthleteDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAthleteByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<AthleteDto>> Handle(GetAthleteByIdQuery request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes
            .AsNoTracking()
            .Where(a => a.Id == request.AthleteId)
            .Select(a => new AthleteDto(
                a.Id,
                a.FirstName,
                a.LastName,
                a.DateOfBirth,
                a.TargetCalories,
                a.TargetSteps,
                a.IsOnboardingCompleted,
                a.PhoneNumber,
                a.Occupation,
                a.MainReason,
                a.ShortTermGoal,
                a.LongTermGoal,
                a.Expectations,
                a.HeightCm,
                a.StartingWeightKg,
                a.TrainingHistory,
                a.CurrentTrainingRoutine,
                a.OutsidePhysicalActivity,
                a.HasTrackedMacros,
                a.HasWorkedWithCoach,
                a.HearAboutUs,
                a.AdditionalNotes,
                a.CreatedAt,
                a.UpdatedAt))
            .FirstOrDefaultAsync(cancellationToken);

        if (athlete is null)
        {
            return Result.Failure<AthleteDto>(new Error("Athlete.NotFound", "Sporcu bulunamadı.", ErrorType.NotFound));
        }

        return Result.Success(athlete);
    }
}
