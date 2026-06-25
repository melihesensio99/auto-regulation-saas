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

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Telefon numaras zorunludur.")
            .MaximumLength(50).WithMessage("Telefon numaras en fazla 50 karakter olabilir.");

        RuleFor(x => x.Occupation)
            .NotEmpty().WithMessage("Meslek/Okul boY braklamaz.")
            .MaximumLength(200).WithMessage("Meslek/Okul en fazla 200 karakter olabilir.");

        RuleFor(x => x.MainReason)
            .MaximumLength(1000).WithMessage("Ana sebep en fazla 1000 karakter olabilir.");

        RuleFor(x => x.ShortTermGoal)
            .NotEmpty().WithMessage("Ksa vadeli hedefler boY braklamaz.")
            .MaximumLength(1000).WithMessage("Ksa vadeli hedefler en fazla 1000 karakter olabilir.");

        RuleFor(x => x.LongTermGoal)
            .NotEmpty().WithMessage("Uzun vadeli hedefler boY braklamaz.")
            .MaximumLength(1000).WithMessage("Uzun vadeli hedefler en fazla 1000 karakter olabilir.");

        RuleFor(x => x.Expectations)
            .NotEmpty().WithMessage("Beklentiler boY braklamaz.")
            .MaximumLength(1000).WithMessage("Beklentiler en fazla 1000 karakter olabilir.");

        RuleFor(x => x.TrainingHistory)
            .NotEmpty().WithMessage("Antrenman gemiYi boY braklamaz.")
            .MaximumLength(1000).WithMessage("Antrenman gemiYi en fazla 1000 karakter olabilir.");

        RuleFor(x => x.CurrentTrainingRoutine)
            .NotEmpty().WithMessage("Mevcut antrenman dzeni boY braklamaz.")
            .MaximumLength(1000).WithMessage("Mevcut antrenman dzeni en fazla 1000 karakter olabilir.");

        RuleFor(x => x.OutsidePhysicalActivity)
            .NotEmpty().WithMessage("Fiziksel aktivite boY braklamaz.")
            .MaximumLength(1000).WithMessage("Fiziksel aktivite en fazla 1000 karakter olabilir.");
    }
}
