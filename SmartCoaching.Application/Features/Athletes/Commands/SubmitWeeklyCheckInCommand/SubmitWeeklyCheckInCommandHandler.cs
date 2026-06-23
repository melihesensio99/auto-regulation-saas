using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using SmartCoaching.Domain.Entities;
using MassTransit;
using SmartCoaching.Application.Common.Events;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Commands.SubmitWeeklyCheckInCommand;

public class SubmitWeeklyCheckInCommandHandler : IRequestHandler<SubmitWeeklyCheckInCommand, Result>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IPublishEndpoint _publishEndpoint;

    public SubmitWeeklyCheckInCommandHandler(IApplicationDbContext dbContext, IPublishEndpoint publishEndpoint)
    {
        _dbContext = dbContext;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result> Handle(SubmitWeeklyCheckInCommand request, CancellationToken cancellationToken)
    {
        // Kural: Haftalık kontrol yalnızca Pazar günü yapılabilir
        if (request.Date.DayOfWeek != DayOfWeek.Sunday)
        {
            return Result.Failure(new Error("WeeklyCheckIn.InvalidDay", "Haftalık kontrol (Check-in) verileri yalnızca Pazar günleri girilebilir."));
        }

        // Kural: Sadece o günkü tarihe giriş yapılabilir (Türkiye saati ile UTC+3)
        var todayInTurkey = DateTime.UtcNow.AddHours(3).Date;
        if (request.Date.Date != todayInTurkey)
        {
            return Result.Failure(new Error("WeeklyCheckIn.InvalidDate", $"Sadece bugünün tarihine ait kontrol verisi girebilirsiniz. Geçmiş veya gelecek günlere veri girilemez. (Sistem Tarihi: {todayInTurkey:yyyy-MM-dd})"));
        }

        var athlete = await _dbContext.Athletes
            .Include(a => a.WeeklyCheckIns)
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
            return Result.Failure(new Error("Athlete.NotFound", "Athlete not found or you do not have permission to access them."));

        var existingCheckIn = athlete.WeeklyCheckIns.FirstOrDefault(w => w.Date.Date == request.Date.Date);
        if (existingCheckIn != null)
        {
            return Result.Failure(new Error("WeeklyCheckIn.Duplicate", "A check-in already exists for this date. You cannot submit multiple check-ins on the same day."));
        }

        var checkIn = new WeeklyCheckIn(
            request.AthleteId,
            request.Date,
            request.WeightKg,
            request.FrontPhotoUrl,
            request.BackPhotoUrl,
            request.SidePhotoUrl
        );

        athlete.AddWeeklyCheckIn(checkIn);
        _dbContext.WeeklyCheckIns.Add(checkIn); // ZORUNLU EKLENDİ: EF Core'un Id dolu diye Modified sanmasını engellemek için!
        await _dbContext.SaveChangesAsync(cancellationToken);

        // Publish integration event to trigger AI Analysis
        await _publishEndpoint.Publish(new WeeklyCheckInSubmittedEvent(checkIn.Id, athlete.Id), cancellationToken);

        return Result.Success();
    }
}
