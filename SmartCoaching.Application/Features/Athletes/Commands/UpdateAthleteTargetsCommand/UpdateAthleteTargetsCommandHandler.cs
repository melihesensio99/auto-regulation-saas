using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Commands.UpdateAthleteTargetsCommand;

public class UpdateAthleteTargetsCommandHandler : IRequestHandler<UpdateAthleteTargetsCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public UpdateAthleteTargetsCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(UpdateAthleteTargetsCommand request, CancellationToken cancellationToken)
    {
        // Sihirli Kısım: HasQueryFilter aktif olduğu için başkasının sporcu ID'sini verse bile 'null' döner.
        var athlete = await _context.Athletes
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete is null)
        {
            return Result.Failure(new Error("Athlete.NotFound", "Belirtilen sporcu bulunamadı veya bu sporcuya erişim izniniz yok."));
        }

        // Değerleri güncelle. TargetSteps null ise mevcut değeri koru (Agent'ın kısmi güncelleme yapabilmesi için).
        var effectiveSteps = request.TargetSteps ?? athlete.TargetSteps;
        athlete.UpdateTargets(request.TargetCalories, effectiveSteps);

        // Veritabanına kaydet
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(); // Sadece 'Başarılı' mesajı dönüyoruz (Veri kusmuyoruz!)
    }
}
