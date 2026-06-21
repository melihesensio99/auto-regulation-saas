using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using SmartCoaching.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Commands.CreateAthlete;

// IRequestHandler demek: "CreateAthleteCommand bana gelirse, onu ben karşılarım ve geriye Result<Guid> dönerim" demektir.
public class CreateAthleteCommandHandler : IRequestHandler<CreateAthleteCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;

    // Veritabanı bağlantısını Constructor üzerinden alıyoruz (Dependency Injection)
    public CreateAthleteCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(CreateAthleteCommand request, CancellationToken cancellationToken)
    {
        // 1. Önce böyle bir antrenör (Coach) var mı diye kontrol et (Kural Motoru)
        var coachExists = await _context.Coaches.AnyAsync(c => c.Id == request.CoachId, cancellationToken);
        if (!coachExists)
        {
            return Result.Failure<Guid>(new Error("Coach.NotFound", "Sisteme bağlı böyle bir antrenör bulunamadı.", ErrorType.NotFound));
        }

        // 2. Güvenlikten geçtik, yeni sporcuyu (Entity) yarat
        var athlete = new Athlete(request.FirstName, request.LastName, request.CoachId, request.DateOfBirth);

        // 3. Veritabanına ekle ve kaydet
        _context.Athletes.Add(athlete);
        await _context.SaveChangesAsync(cancellationToken);

        // 4. İşlem başarılı kargo kutusunu (Result) dön! İçinde de yeni sporcunun ID'si olsun.
        return Result.Success(athlete.Id);
    }
}
