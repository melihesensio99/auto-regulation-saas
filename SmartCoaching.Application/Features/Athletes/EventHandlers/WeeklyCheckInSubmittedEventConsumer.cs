using MassTransit;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Events;
using SmartCoaching.Application.Common.Interfaces;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.EventHandlers;

public class WeeklyCheckInSubmittedEventConsumer : IConsumer<WeeklyCheckInSubmittedEvent>
{
    private readonly IApplicationDbContext _context;
    private readonly IAiService _aiService;

    public WeeklyCheckInSubmittedEventConsumer(IApplicationDbContext context, IAiService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    public async Task Consume(ConsumeContext<WeeklyCheckInSubmittedEvent> context)
    {
        var message = context.Message;

        var athlete = await _context.Athletes
            .Include(a => a.DailyProgresses)
            .Include(a => a.WeeklyCheckIns)
            .FirstOrDefaultAsync(a => a.Id == message.AthleteId);

        if (athlete == null) return;

        var checkIn = athlete.WeeklyCheckIns.FirstOrDefault(w => w.Id == message.WeeklyCheckInId);
        if (checkIn == null) return;

        // Get past 7 days of daily progress
        var startDate = checkIn.Date.AddDays(-7);
        var pastWeekProgress = athlete.DailyProgresses
            .Where(p => p.Date >= startDate && p.Date < checkIn.Date)
            .OrderBy(p => p.Date)
            .ToList();

        // Build the Prompt
        var sb = new StringBuilder();
        sb.AppendLine("Aşağıda bir sporcunun son bir haftalık verileri bulunmaktadır.");
        sb.AppendLine($"Hedef Günlük Kalori: {athlete.TargetCalories}");
        sb.AppendLine($"Hedef Günlük Adım: {athlete.TargetSteps}");
        sb.AppendLine("Günlük Kayıtlar:");

        foreach (var day in pastWeekProgress)
        {
            var dayName = day.Date.ToString("dddd", new System.Globalization.CultureInfo("tr-TR"));
            string workoutStatus = day.IsWorkoutCompleted ? "Antrenman yapıldı" : "Antrenman yapılmadı";
            string weightStatus = day.WeightKg.HasValue ? $"{day.WeightKg} kg" : "Kilo girilmedi";
            
            sb.AppendLine($"- {dayName}: Kalori {day.ConsumedCalories}, Adım {day.TakenSteps}, {workoutStatus}, Tartı: {weightStatus}");
        }

        sb.AppendLine($"Hafta Sonu Final Tartısı (Check-In): {checkIn.WeightKg} kg");
        sb.AppendLine();
        sb.AppendLine("Lütfen bu verileri koç için analiz et. Sporcu hedeflerine uydu mu? Kilo trendi nasıl? Antrenmanlarını aksattığı günler kioyu veya kaloriyi etkilemiş mi? Koça ne yapmasını tavsiye edersin?");

        // Call AI Service
        var prompt = sb.ToString();
        var aiResponse = await _aiService.GenerateWeeklyAnalysisAsync(prompt, context.CancellationToken);

        // Update CheckIn
        checkIn.SetAiAnalysis(aiResponse);
        await _context.SaveChangesAsync(context.CancellationToken);
    }
}
