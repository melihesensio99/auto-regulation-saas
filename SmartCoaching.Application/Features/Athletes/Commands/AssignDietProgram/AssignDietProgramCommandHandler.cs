using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Features.Athletes.Services;
using SmartCoaching.Domain.Common;
using SmartCoaching.Domain.Entities;
using MassTransit;
using SmartCoaching.Application.Common.Events;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignDietProgram;

public class AssignDietProgramCommandHandler : IRequestHandler<AssignDietProgramCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly IPublishEndpoint _publishEndpoint;

    public AssignDietProgramCommandHandler(IApplicationDbContext context, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _publishEndpoint = publishEndpoint;
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
            Notes = m.Notes,
            Order = m.Order,
            Protein = m.Protein,
            Carbs = m.Carbs,
            Fats = m.Fats,
            Calories = m.Calories
        }).ToList();

        athlete.SetDietMeals(newMeals, request.GeneralDietNotes);

        await _context.SaveChangesAsync(cancellationToken);

        // Publish event for AI macro calculation
        await _publishEndpoint.Publish(new DietPlanAssignedEvent(athlete.Id), cancellationToken);

        // Auto Notification Logic (Refactored to Helper)
        if (newMeals.Any())
        {
            await ProgramNotificationHelper.CheckAndSendProgramPublishedEventAsync(athlete, _context, _publishEndpoint, cancellationToken);
        }

        return Result.Success(athlete.Id);
    }
}
