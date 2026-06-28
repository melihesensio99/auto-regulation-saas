using FluentValidation;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.CreateAthlete;

public class CreateAthleteCommandValidator : AbstractValidator<CreateAthleteCommand>
{
    public CreateAthleteCommandValidator()
    {
        // İsim boş olamaz ve maksimum 50 karakter olmalı
        RuleFor(x => x.FirstName)
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Sporcu adı boş olamaz.")
            .MaximumLength(50).WithMessage("Sporcu adı 50 karakteri geçemez.");

        RuleFor(x => x.LastName)
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Sporcu soyadı boş olamaz.")
            .MaximumLength(50).WithMessage("Sporcu soyadı 50 karakteri geçemez.");


        // Abonelik bitiş tarihi bugünden ileri bir tarih olmalı
        RuleFor(x => x.SubscriptionEndDate)
            .NotEmpty().WithMessage("Üyelik bitiş tarihi boş olamaz.")
            .GreaterThan(DateTime.UtcNow).WithMessage("Üyelik bitiş tarihi bugünden daha ileri bir tarih olmalıdır.");
    }
}
