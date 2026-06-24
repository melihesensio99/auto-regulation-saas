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
        var athlete = await _context.Athletes
            .Include(a => a.DietMeals)
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);
        
        if (athlete == null)
            return Result.Failure<DietProgramResponseDto>(new Error("Athlete.NotFound", "Sporcu bulunamadı.", ErrorType.NotFound));

        var meals = athlete.DietMeals
            .OrderBy(m => m.Order)
            .Select(m => new DietMealResponseDto(
                m.Id,
                m.Order,
                m.MealName,
                m.Foods,
                m.Notes,
                m.Protein,
                m.Carbs,
                m.Fats,
                m.Calories
            ))
            .ToList();

        var response = new DietProgramResponseDto(
            athlete.Id,
            athlete.GeneralDietNotes,
            meals
        );

        return Result<DietProgramResponseDto>.Success(response);
    }
}
