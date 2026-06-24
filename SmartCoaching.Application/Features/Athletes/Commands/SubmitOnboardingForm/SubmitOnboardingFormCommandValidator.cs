using FluentValidation;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.SubmitOnboardingForm;

public class SubmitOnboardingFormCommandValidator : AbstractValidator<SubmitOnboardingFormCommand>
{
    public SubmitOnboardingFormCommandValidator()
    {
        RuleFor(x => x.HeightCm)
            .InclusiveBetween(100, 250).WithMessage("Boy 100 cm ile 250 cm arasında olmalıdır.");

        RuleFor(x => x.StartingWeightKg)
            .InclusiveBetween(30, 300).WithMessage("Kilo 30 kg ile 300 kg arasında olmalıdır.");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Doğum tarihi zorunludur.")
            .LessThan(DateTime.UtcNow.AddYears(-10)).WithMessage("Sisteme kayıt olmak için en az 10 yaşında olmalısınız.")
            .GreaterThan(DateTime.UtcNow.AddYears(-100)).WithMessage("Geçersiz doğum tarihi.");

        RuleFor(x => x.InjuryHistory)
            .MaximumLength(1000).WithMessage("Sakatlık geçmişi en fazla 1000 karakter olabilir.");

        RuleFor(x => x.Goals)
            .NotEmpty().WithMessage("Hedefler boş bırakılamaz.")
            .MaximumLength(1000).WithMessage("Hedefler en fazla 1000 karakter olabilir.");

        RuleFor(x => x.Lifestyle)
            .NotEmpty().WithMessage("Hayat şartları boş bırakılamaz.")
            .MaximumLength(1000).WithMessage("Hayat şartları en fazla 1000 karakter olabilir.");

        RuleFor(x => x.SupplementUsage)
            .MaximumLength(1000).WithMessage("Supplement kullanımı en fazla 1000 karakter olabilir.");

        RuleFor(x => x.DietaryPreferences)
            .MaximumLength(1000).WithMessage("Beslenme tercihleri en fazla 1000 karakter olabilir.");
    }
}
