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
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
            return Result.Failure<Guid>(new Error("Athlete.NotFound", "Sporcu bulunamadı.", ErrorType.NotFound));

        var incomingGeneralNotes = request.GeneralDietNotes?.Trim() ?? string.Empty;
        var incomingMeals = request.Meals
            .OrderBy(m => m.Order)
            .Select(m => new
            {
                m.Order,
                MealName = m.MealName.Trim(),
                Foods = m.Foods.Trim(),
                Notes = m.Notes.Trim()
            })
            .ToList();

        var currentGeneralNotes = athlete.GeneralDietNotes?.Trim() ?? string.Empty;
        var currentMeals = await _context.DietMeals
            .AsNoTracking()
            .Where(m => m.AthleteId == athlete.Id)
            .OrderBy(m => m.Order)
            .Select(m => new
            {
                m.Order,
                MealName = m.MealName.Trim(),
                Foods = m.Foods.Trim(),
                Notes = m.Notes.Trim()
            })
            .ToListAsync(cancellationToken);

        var isSameProgram =
            string.Equals(currentGeneralNotes, incomingGeneralNotes, StringComparison.Ordinal) &&
            currentMeals.Count == incomingMeals.Count &&
            currentMeals.Zip(incomingMeals, (current, incoming) =>
                current.Order == incoming.Order &&
                current.MealName == incoming.MealName &&
                current.Foods == incoming.Foods &&
                current.Notes == incoming.Notes).All(x => x);

        if (isSameProgram)
            return Result.Success(athlete.Id);

        var newMeals = request.Meals.Select(m => new DietMeal
        {
            AthleteId = athlete.Id,
            MealName = m.MealName,
            Foods = m.Foods,
            Notes = m.Notes,
            Order = m.Order
        }).ToList();

        await _context.DietMeals
            .Where(m => m.AthleteId == athlete.Id)
            .ExecuteDeleteAsync(cancellationToken);

        athlete.SetDietMeals(newMeals, incomingGeneralNotes);
        _context.DietMeals.AddRange(newMeals);

        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(athlete.Id);
    }
}
