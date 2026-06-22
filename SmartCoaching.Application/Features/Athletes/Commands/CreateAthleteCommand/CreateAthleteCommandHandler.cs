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
    private readonly ICurrentUserService _currentUserService;

    public CreateAthleteCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<Guid>> Handle(CreateAthleteCommand request, CancellationToken cancellationToken)
    {
        // 1. Önce giriş yapmış bir antrenör var mı diye kontrol et (Kural Motoru)
        var coachId = _currentUserService.TenantId;
        var coachExists = await _context.Coaches.AnyAsync(c => c.Id == coachId, cancellationToken);
        if (!coachExists)
        {
            return Result.Failure<Guid>(new Error("Coach.NotFound", "Sisteme giriş yapmış geçerli bir antrenör bulunamadı.", ErrorType.Unauthorized));
        }

        // 2. Güvenlikten geçtik, yeni sporcuyu (Entity) yarat
        var athlete = Athlete.Create(request.FirstName, request.LastName, request.DateOfBirth, request.HeightCm, request.StartingWeightKg, coachId);

        // 3. Veritabanına ekle ve kaydet
        _context.Athletes.Add(athlete);
        await _context.SaveChangesAsync(cancellationToken);

        // 4. İşlem başarılı kargo kutusunu (Result) dön! İçinde de yeni sporcunun ID'si olsun.
        return Result.Success(athlete.Id);
    }
}
