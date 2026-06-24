using FluentValidation;

namespace SmartCoaching.Application.Features.Athletes.Commands.LogProgressCommand;

public class LogProgressCommandValidator : AbstractValidator<LogProgressCommand>
{
    public LogProgressCommandValidator()
    {
        RuleFor(x => x.AthleteId)
            .NotEmpty().WithMessage("Sporcu ID boş olamaz.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Tarih boş olamaz.");

        RuleFor(x => x.ConsumedCalories)
            .GreaterThanOrEqualTo(0).WithMessage("Alınan kalori 0'dan küçük olamaz.");

        RuleFor(x => x.TakenSteps)
            .GreaterThanOrEqualTo(0).WithMessage("Atılan adım 0'dan küçük olamaz.");

        RuleFor(x => x.WeightKg)
            .GreaterThan(20).When(x => x.WeightKg.HasValue).WithMessage("Kilo 20'den büyük olmalıdır.")
            .LessThan(300).When(x => x.WeightKg.HasValue).WithMessage("Kilo 300'den küçük olmalıdır.");
            
        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notlar en fazla 500 karakter olabilir.");
    }
}
