using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using SmartCoaching.Domain.Constants;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteCheckIns;

public class GetAthleteCheckInsQueryHandler : IRequestHandler<GetAthleteCheckInsQuery, Result<List<WeeklyCheckInDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetAthleteCheckInsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<List<WeeklyCheckInDto>>> Handle(GetAthleteCheckInsQuery request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes
            .Include(a => a.WeeklyCheckIns)
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
            return Result.Failure<List<WeeklyCheckInDto>>(new Error("Athlete.NotFound", "Sporcu bulunamadı veya yetkiniz yok."));

        var isAthlete = _currentUserService.Role == Roles.Athlete;

        var checkIns = athlete.WeeklyCheckIns
            .OrderByDescending(w => w.Date)
            .Select(w => new WeeklyCheckInDto(
                w.Id,
                w.Date,
                w.WeightKg,
                w.FrontPhotoUrl,
                w.BackPhotoUrl,
                w.SidePhotoUrl,
                w.CoachFeedback,
                // AI Analizini sadece KOÇ görebilir. Sporcu istek atıyorsa NULL döner.
                isAthlete ? null : w.AiAnalysis
            )).ToList();

        return Result.Success<List<WeeklyCheckInDto>>(checkIns);
    }
}
