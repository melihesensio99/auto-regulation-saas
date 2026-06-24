using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using SmartCoaching.Domain.Entities;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.LogProgressCommand;

public class LogProgressCommandHandler : IRequestHandler<LogProgressCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public LogProgressCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(LogProgressCommand request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes
            .Include(a => a.ProgressLogs)
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete is null)
        {
            return Result.Failure(new Error("Athlete.NotFound", "Sporcu bulunamadı veya yetkiniz yok."));
        }

        var existingLog = athlete.ProgressLogs.FirstOrDefault(p => p.Date.Date == request.Date.Date);

        if (existingLog != null)
        {
            existingLog.UpdateMetrics(
                request.ConsumedCalories, 
                request.TakenSteps, 
                request.IsWorkoutCompleted, 
                request.WeightKg, 
                request.Notes,
                request.FrontPhotoUrl,
                request.BackPhotoUrl,
                request.SidePhotoUrl);
        }
        else
        {
            var newLog = ProgressLog.Create(
                athlete.Id,
                request.Date,
                request.ConsumedCalories,
                request.TakenSteps,
                request.IsWorkoutCompleted,
                request.WeightKg,
                request.Notes,
                request.FrontPhotoUrl,
                request.BackPhotoUrl,
                request.SidePhotoUrl
            );
            
            athlete.AddProgressLog(newLog);
            _context.ProgressLogs.Add(newLog);
        }

        try
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException)
        {
            return Result.Failure(new Error("Concurrency.Conflict", "Aynı anda birden fazla cihazdan güncelleme yapılmaya çalışıldı. Lütfen sayfayı yenileyip tekrar deneyin."));
        }

        return Result.Success();
    }
}
