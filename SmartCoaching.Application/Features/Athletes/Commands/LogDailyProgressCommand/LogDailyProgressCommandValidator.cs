using FluentValidation;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.LogDailyProgressCommand;

public class LogDailyProgressCommandValidator : AbstractValidator<LogDailyProgressCommand>
{
    public LogDailyProgressCommandValidator()
    {
        RuleFor(x => x.AthleteId)
            .NotEmpty().WithMessage("Sporcu ID'si boş olamaz.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Tarih boş olamaz.")
            .LessThanOrEqualTo(DateTime.UtcNow.AddDays(1)).WithMessage("Gelecek bir tarih için veri girilemez.");

        RuleFor(x => x.ConsumedCalories)
            .GreaterThanOrEqualTo(0).WithMessage("Alınan kalori sıfırdan küçük olamaz.");

        RuleFor(x => x.TakenSteps)
            .GreaterThanOrEqualTo(0).WithMessage("Atılan adım sıfırdan küçük olamaz.");
    }
}
