using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetDietProgram;

public class GetAthleteDietProgramQueryHandler : IRequestHandler<GetAthleteDietProgramQuery, Result<DietProgramResponseDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAthleteDietProgramQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<DietProgramResponseDto>> Handle(GetAthleteDietProgramQuery request, CancellationToken cancellationToken)
    {
        var athleteExists = await _context.Athletes.AnyAsync(a => a.Id == request.AthleteId, cancellationToken);
        
        if (!athleteExists)
            return Result.Failure<DietProgramResponseDto>(new Error("Athlete.NotFound", "Sporcu bulunamadı.", ErrorType.NotFound));

        var meals = await _context.DietMeals
            .Where(m => m.AthleteId == request.AthleteId)
            .Select(m => new DietMealResponseDto(
                m.Id,
                m.MealName,
                m.Foods,
                m.Notes
            ))
            .ToListAsync(cancellationToken);

        var response = new DietProgramResponseDto(
            request.AthleteId,
            meals
        );

        return Result<DietProgramResponseDto>.Success(response);
    }
}
