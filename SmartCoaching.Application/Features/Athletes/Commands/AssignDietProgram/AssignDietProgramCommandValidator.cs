using FluentValidation;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignDietProgram;

public class AssignDietProgramCommandValidator : AbstractValidator<AssignDietProgramCommand>
{
    public AssignDietProgramCommandValidator()
    {
        RuleFor(v => v.AthleteId)
            .NotEmpty().WithMessage("Sporcu ID'si boş olamaz.");

        RuleFor(v => v.Meals)
            .NotNull().WithMessage("Öğün listesi boş olamaz.")
            .NotEmpty().WithMessage("En az bir öğün eklemelisin.");

        RuleForEach(v => v.Meals).SetValidator(new DietMealDtoValidator());
    }
}
