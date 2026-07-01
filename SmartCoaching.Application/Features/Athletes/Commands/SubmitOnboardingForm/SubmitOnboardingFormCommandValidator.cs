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
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Telefon numarası zorunludur.")
            .MaximumLength(50).WithMessage("Telefon numarası en fazla 50 karakter olabilir.");

        RuleFor(x => x.Occupation)
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Meslek/Okul boş bırakılamaz.")
            .MaximumLength(200).WithMessage("Meslek/Okul en fazla 200 karakter olabilir.");

        RuleFor(x => x.MainReason)
            .NotNull().WithMessage("Ana sebep boş bırakılamaz.")
            .IsInEnum().WithMessage("Geçersiz ana sebep seçimi.");

        RuleFor(x => x.ShortTermGoal)
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Kısa vadeli hedef boş bırakılamaz.")
            .MaximumLength(1000).WithMessage("Kısa vadeli hedef en fazla 1000 karakter olabilir.");

        RuleFor(x => x.LongTermGoal)
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Uzun vadeli hedef boş bırakılamaz.")
            .MaximumLength(1000).WithMessage("Uzun vadeli hedef en fazla 1000 karakter olabilir.");

        RuleFor(x => x.Expectations)
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Beklentiler boş bırakılamaz.")
            .MaximumLength(1000).WithMessage("Beklentiler en fazla 1000 karakter olabilir.");

        RuleFor(x => x.TrainingHistory)
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Antrenman geçmişi boş bırakılamaz.")
            .MaximumLength(1000).WithMessage("Antrenman geçmişi en fazla 1000 karakter olabilir.");

        RuleFor(x => x.CurrentTrainingRoutine)
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Mevcut antrenman düzeni boş bırakılamaz.")
            .MaximumLength(1000).WithMessage("Mevcut antrenman düzeni en fazla 1000 karakter olabilir.");

        RuleFor(x => x.OutsidePhysicalActivity)
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Fiziksel aktivite boş bırakılamaz.")
            .MaximumLength(1000).WithMessage("Fiziksel aktivite en fazla 1000 karakter olabilir.");
    }
}
