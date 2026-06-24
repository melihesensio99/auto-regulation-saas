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
            .Include(a => a.ProgressLogs)
            .FirstOrDefaultAsync(a => a.Id == request.AthleteId, cancellationToken);

        if (athlete == null)
            return Result.Failure(new Error("Athlete.NotFound", "Sporcu bulunamadı veya yetkiniz yok."));

        var progressLog = athlete.ProgressLogs.FirstOrDefault(w => w.Id == request.ProgressLogId);
        if (progressLog == null)
            return Result.Failure(new Error("ProgressLog.NotFound", "İlgili gelişim kaydı bulunamadı."));

        progressLog.AddCoachFeedback(request.Feedback);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
