using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using SmartCoaching.Domain.Entities;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Commands.LogDailyProgressCommand;

public class LogDailyProgressCommandHandler : IRequestHandler<LogDailyProgressCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public LogDailyProgressCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(LogDailyProgressCommand request, CancellationToken cancellationToken)
    {
        // Tarih Kontrolü: Yalnızca "bugün" için giriş yapılabilir (Türkiye saati ile UTC+3)
        var todayInTurkey = DateTime.UtcNow.AddHours(3).Date;
        if (request.Date.Date != todayInTurkey)
        {
            return Result.Failure(new Error("DailyProgress.InvalidDate", $"Sadece bugünün tarihine ait günlük giriş yapabilirsiniz. Geçmiş veya gelecek günlere veri girilemez. (Sistem Tarihi: {todayInTurkey:yyyy-MM-dd})"));
        }

        // Global Query Filter devrede! Başkasının sporcusuna veri girilemez.
        var athlete = await _context.Athletes
            .Include(a => a.DailyProgresses)
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete is null)
        {
            return Result.Failure(new Error("Athlete.NotFound", "Sporcu bulunamadı veya yetkiniz yok."));
        }

        // Akıllı Kaydetme (Upsert) Kuralı Devrede!
        var existingProgress = athlete.DailyProgresses.FirstOrDefault(p => p.Date == request.Date.Date);

        if (existingProgress != null)
        {
            existingProgress.UpdateMetrics(request.ConsumedCalories, request.TakenSteps, request.WeightKg, request.IsWorkoutCompleted, request.Notes);
        }
        else
        {
            var newProgress = DailyProgress.Create(
                athlete.Id,
                request.Date,
                request.ConsumedCalories,
                request.TakenSteps,
                request.WeightKg,
                request.IsWorkoutCompleted,
                request.Notes
            );
            athlete.AddDailyProgress(newProgress);
            _context.DailyProgresses.Add(newProgress); // ZORUNLU EKLENDİ: EF Core'un Id dolu diye Modified sanmasını engellemek için!
        }

        try
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException ex)
        {
            var entry = ex.Entries.FirstOrDefault();
            var entityName = entry?.Entity.GetType().Name;
            var state = entry?.State.ToString();
            var id = (entry?.Entity as SmartCoaching.Domain.Common.BaseEntity)?.Id;
            return Result.Failure(new Error("Concurrency.Debug", $"Hata detayı -> Entity: {entityName}, State: {state}, Id: {id}. Lütfen bu hatayı bana gönderin!"));
        }

        return Result.Success();
    }
}
