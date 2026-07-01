using MassTransit;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Events;
using SmartCoaching.Application.Common.Interfaces;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.EventHandlers;

public class DietProgramUpdatedEventConsumer : IConsumer<DietProgramUpdatedEvent>
{
    private readonly IApplicationDbContext _context;
    private readonly IAiService _aiService;

    public DietProgramUpdatedEventConsumer(IApplicationDbContext context, IAiService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    public async Task Consume(ConsumeContext<DietProgramUpdatedEvent> context)
    {
        var athleteId = context.Message.AthleteId;

        var athlete = await _context.Athletes
            .Include(a => a.DietMeals)
            .FirstOrDefaultAsync(a => a.Id == athleteId, context.CancellationToken);

        if (athlete == null || !athlete.DietMeals.Any())
            return;

        // Yiyecekleri metin olarak birleştir (AI analizi için)
        var mealsPayload = string.Join("\n", athlete.DietMeals.OrderBy(m => m.Order).Select(m => $"{m.MealName}: {m.Foods}"));
        
        // AI'dan makro tahmini al
        var macroResultJson = await _aiService.CalculateMacrosAsync(mealsPayload, context.CancellationToken);

        int calories = 0, protein = 0, carbs = 0, fats = 0;

        try
        {
            using var doc = JsonDocument.Parse(macroResultJson);
            var root = doc.RootElement;

            if (root.TryGetProperty("Calories", out var calProp)) calories = calProp.GetInt32();
            if (root.TryGetProperty("Protein", out var proProp)) protein = proProp.GetInt32();
            if (root.TryGetProperty("Carbs", out var carbProp)) carbs = carbProp.GetInt32();
            if (root.TryGetProperty("Fats", out var fatProp)) fats = fatProp.GetInt32();
        }
        catch
        {
            // Parse hatası veya API hatası durumunda 0 kalacak.
        }

        // Hesaplanan makroları kaydet
        athlete.SetDietProgramSummary(calories, protein, carbs, fats);
        
        await _context.SaveChangesAsync(context.CancellationToken);
    }
}
