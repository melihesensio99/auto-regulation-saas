using System;
using System.ComponentModel;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;
using SmartCoaching.Application.Common.Interfaces;

namespace SmartCoaching.Infrastructure.AI.Plugins;

/// <summary>
/// Sporcuyu bulma, profilini okuma ve gelişim verisini çekme yeteneklerini içerir.
/// coachId hiçbir zaman LLM'den gelmez; IAgentCoachContext üzerinden JWT'den enjekte edilir.
/// </summary>
public class AthletePlugin
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    private readonly IApplicationDbContext _context;
    private readonly IAgentCoachContext _coachContext;

    public AthletePlugin(IApplicationDbContext context, IAgentCoachContext coachContext)
    {
        _context = context;
        _coachContext = coachContext;
    }

    [KernelFunction("GetAthletes")]
    [Description("Koça ait tüm sporcuları ve ID'lerini listeler. Sporcu adı verildiğinde önce bu araçla doğru sporcu bulunur.")]
    public async Task<string> GetAthletesAsync(CancellationToken cancellationToken)
    {
        var coachId = _coachContext.CoachId;

        var athletes = await _context.Athletes
            .Where(a => a.CoachId == coachId)
            .Select(a => new
            {
                a.Id,
                a.FirstName,
                a.LastName,
                a.TargetCalories,
                a.TargetSteps
            })
            .ToListAsync(cancellationToken);

        return JsonSerializer.Serialize(athletes, JsonOptions);
    }

    [KernelFunction("GetAthleteProfile")]
    [Description("Belirli bir sporcunun profilini, hedeflerini ve amaç bilgilerini getirir.")]
    public async Task<string> GetAthleteProfileAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        CancellationToken cancellationToken)
    {
        var coachId = _coachContext.CoachId;

        var athlete = await _context.Athletes
            .Where(a => a.Id == athleteId && a.CoachId == coachId)
            .Select(a => new
            {
                a.Id,
                a.FirstName,
                a.LastName,
                a.TargetCalories,
                a.TargetSteps,
                a.MainReason,
                a.ShortTermGoal,
                a.LongTermGoal,
                a.HeightCm,
                a.StartingWeightKg,
                a.AdditionalNotes,
                a.CurrentTrainingRoutine,
                a.TrainingHistory,
                a.Expectations,
                a.OutsidePhysicalActivity,
                a.HasTrackedMacros,
                a.HasWorkedWithCoach
            })
            .FirstOrDefaultAsync(cancellationToken);

        return athlete is null
            ? "{\"error\": \"Athlete not found or not assigned to you.\"}"
            : JsonSerializer.Serialize(athlete, JsonOptions);
    }

    [KernelFunction("GetAthleteProgress")]
    [Description("Belirli bir sporcunun son 7 günlük verilerini getirir. Adım, kalori, kilo, not ve koç geri bildirimi içerir.")]
    public async Task<string> GetAthleteProgressAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        CancellationToken cancellationToken)
    {
        var coachId = _coachContext.CoachId;

        var athleteExists = await _context.Athletes
            .AnyAsync(a => a.Id == athleteId && a.CoachId == coachId, cancellationToken);

        if (!athleteExists)
        {
            return "{\"error\": \"Athlete not found or not assigned to you.\"}";
        }

        var logs = await _context.ProgressLogs
            .Where(p => p.AthleteId == athleteId)
            .OrderByDescending(p => p.Date)
            .Take(7)
            .Select(p => new
            {
                p.Date,
                p.TakenSteps,
                p.ConsumedCalories,
                p.IsWorkoutCompleted,
                p.WeightKg,
                p.Notes,
                p.CoachFeedback,
                p.AiAnalysis
            })
            .ToListAsync(cancellationToken);

        return JsonSerializer.Serialize(logs, JsonOptions);
    }

    [KernelFunction("GetAthleteConsumedFoods")]
    [Description("Belirli bir sporcunun son 3 gündeki detaylı besin tüketim listesini (ör. Hamburger, Pizza vb.) getirir.")]
    public async Task<string> GetAthleteConsumedFoodsAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        CancellationToken cancellationToken)
    {
        var coachId = _coachContext.CoachId;

        var athleteExists = await _context.Athletes
            .AnyAsync(a => a.Id == athleteId && a.CoachId == coachId, cancellationToken);

        if (!athleteExists)
        {
            return "{\"error\": \"Athlete not found or not assigned to you.\"}";
        }

        var cutoffDate = DateTime.UtcNow.AddDays(-3);

        var foods = await _context.ConsumedFoods
            .Where(f => f.AthleteId == athleteId && f.Date >= cutoffDate)
            .OrderByDescending(f => f.Date)
            .Select(f => new
            {
                f.Date,
                f.FoodName,
                f.Calories,
                f.Protein,
                f.Carbs,
                f.Fats
            })
            .ToListAsync(cancellationToken);

        return JsonSerializer.Serialize(foods, JsonOptions);
    }
}
