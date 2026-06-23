using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.Commands.AddCoachFeedback;

public class AddCoachFeedbackCommandHandler : IRequestHandler<AddCoachFeedbackCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public AddCoachFeedbackCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(AddCoachFeedbackCommand request, CancellationToken cancellationToken)
    {
        var athlete = await _context.Athletes
            .Include(a => a.WeeklyCheckIns)
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
            return Result.Failure(new Error("Athlete.NotFound", "Sporcu bulunamadı veya yetkiniz yok."));

        var checkIn = athlete.WeeklyCheckIns.FirstOrDefault(w => w.Id == request.CheckInId);
        if (checkIn == null)
            return Result.Failure(new Error("WeeklyCheckIn.NotFound", "İlgili haftalık tartı kaydı bulunamadı."));

        checkIn.AddCoachFeedback(request.Feedback);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
