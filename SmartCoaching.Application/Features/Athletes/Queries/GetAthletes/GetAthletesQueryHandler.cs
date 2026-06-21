using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthletes;

public class GetAthletesQueryHandler : IRequestHandler<GetAthletesQuery, Result<List<AthleteDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAthletesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<AthleteDto>>> Handle(GetAthletesQuery request, CancellationToken cancellationToken)
    {
        // Sihir burada! Hiçbir yere 'Where(CoachId == falan_filan)' yazmıyoruz.
        // Çünkü ApplicationDbContext içindeki 'HasQueryFilter' bizim yerimize bunu arka planda her sorguya ekliyor.
        // AsNoTracking() => Okuma işlemlerinde Entity Framework'ün takip mekanizmasını kapatarak performansı uçurur.
        
        var athletes = await _context.Athletes
            .AsNoTracking()
            .Select(a => new AthleteDto(
                a.Id,
                a.FirstName,
                a.LastName,
                a.DateOfBirth,
                a.TargetCalories,
                a.TargetSteps,
                a.CreatedAt,
                a.UpdatedAt))
            .ToListAsync(cancellationToken);

        return Result.Success(athletes);
    }
}
