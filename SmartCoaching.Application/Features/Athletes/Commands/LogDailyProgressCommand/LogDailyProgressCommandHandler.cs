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

        if (existingProgress is not null)
        {
            // O günün kaydı VARSA -> Güncelle (Update)
            existingProgress.UpdateMetrics(request.ConsumedCalories, request.TakenSteps, request.Notes);
        }
        else
        {
            // O günün kaydı YOKSA -> Yeni Oluştur (Insert)
            var progress = new DailyProgress(
                athlete.Id,
                request.Date,
                request.ConsumedCalories,
                request.TakenSteps,
                request.Notes
            );

            athlete.AddDailyProgress(progress);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
