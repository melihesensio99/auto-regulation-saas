using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using SmartCoaching.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Coaches.Commands.CreateCoach;

public class CreateCoachCommandHandler : IRequestHandler<CreateCoachCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;

    public CreateCoachCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(CreateCoachCommand request, CancellationToken cancellationToken)
    {
        // 1. Aynı e-posta ile kayıtlı başka antrenör var mı?
        var emailExists = await _context.Coaches.AnyAsync(c => c.Email == request.Email, cancellationToken);
        if (emailExists)
        {
            return Result.Failure<Guid>(new Error("Coach.DuplicateEmail", "Bu e-posta adresi zaten kullanımda.", ErrorType.Conflict));
        }

        // 2. Yeni Antrenörü Yarat (İleride şifreyi Hash'leyeceğiz, şimdilik düz kaydediyoruz)
        var coach = new Coach(request.FirstName, request.LastName, request.Email, request.Password);

        // 3. Veritabanına kaydet
        _context.Coaches.Add(coach);
        await _context.SaveChangesAsync(cancellationToken);

        // 4. Yeni Antrenörün ID'sini dön
        return Result.Success(coach.Id);
    }
}
