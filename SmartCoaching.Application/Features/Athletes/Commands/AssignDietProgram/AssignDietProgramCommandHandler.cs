using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using SmartCoaching.Domain.Entities;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignDietProgram;

public class AssignDietProgramCommandHandler : IRequestHandler<AssignDietProgramCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;

    public AssignDietProgramCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(AssignDietProgramCommand request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes
            .Include(a => a.DietMeals)
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
            return Result.Failure<Guid>(new Error("Athlete.NotFound", "Sporcu bulunamadı.", ErrorType.NotFound));

        // Create new diet meal list
        var newMeals = request.Meals.Select(m => new DietMeal
        {
            AthleteId = athlete.Id,
            Athlete = athlete,
            MealName = m.MealName,
            Foods = m.Foods,
            Notes = m.Notes
        }).ToList();

        athlete.SetDietMeals(newMeals);

        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(athlete.Id);
    }
}
