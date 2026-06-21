using FluentValidation;

namespace SmartCoaching.Application.Features.Athletes.Commands.UpdateAthleteTargetsCommand;

public class UpdateAthleteTargetsCommandValidator : AbstractValidator<UpdateAthleteTargetsCommand>
{
    public UpdateAthleteTargetsCommandValidator()
    {
        RuleFor(x => x.AthleteId)
            .NotEmpty().WithMessage("Sporcu ID'si boş olamaz.");

        RuleFor(x => x.TargetCalories)
            .GreaterThan(0).WithMessage("Hedef kalori 0'dan büyük olmalıdır.");

        RuleFor(x => x.TargetSteps)
            .GreaterThan(0).WithMessage("Hedef adım 0'dan büyük olmalıdır.");
    }
}
