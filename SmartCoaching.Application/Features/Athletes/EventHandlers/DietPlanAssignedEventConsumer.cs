using MassTransit;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Events;
using SmartCoaching.Application.Common.Interfaces;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using System;

namespace SmartCoaching.Application.Features.Athletes.EventHandlers;

public class DietPlanAssignedEventConsumer : IConsumer<DietPlanAssignedEvent>
{
    private readonly IApplicationDbContext _context;
    private readonly IAiService _aiService;

    public DietPlanAssignedEventConsumer(IApplicationDbContext context, IAiService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    public async Task Consume(ConsumeContext<DietPlanAssignedEvent> context)
    {
        var athleteId = context.Message.AthleteId;

        var athlete = await _context.Athletes
            .Include(a => a.DietMeals)
            .FirstOrDefaultAsync(a => a.Id == athleteId, context.CancellationToken);

        if (athlete == null || !athlete.DietMeals.Any())
            return;

        var mealsPayload = athlete.DietMeals.Select(m => new
        {
            m.Order,
            m.MealName,
            m.Foods
        }).ToList();

        var jsonPayload = JsonSerializer.Serialize(mealsPayload);

        string responseJson = await _aiService.CalculateMacrosAsync(jsonPayload, context.CancellationToken);

        try
        {
            string cleanJson = responseJson.Trim();
            if (cleanJson.StartsWith("```json")) cleanJson = cleanJson.Substring(7);
            if (cleanJson.StartsWith("```")) cleanJson = cleanJson.Substring(3);
            if (cleanJson.EndsWith("```")) cleanJson = cleanJson.Substring(0, cleanJson.Length - 3);
            cleanJson = cleanJson.Trim();

            var macros = JsonSerializer.Deserialize<MacroDto>(cleanJson);

            if (macros != null)
            {
                athlete.SetDietProgramSummary(macros.Calories, macros.Protein, macros.Carbs, macros.Fats);

                await _context.SaveChangesAsync(context.CancellationToken);
            }
        }
        catch 
        {
            // Silently fail if AI format is wrong or something else happens
        }
    }
}
