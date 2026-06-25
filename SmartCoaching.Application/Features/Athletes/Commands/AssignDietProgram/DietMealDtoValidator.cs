using FluentValidation;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignDietProgram;

public class DietMealDtoValidator : AbstractValidator<DietMealDto>
{
    public DietMealDtoValidator()
    {
        RuleFor(v => v.MealName)
            .NotEmpty().WithMessage("Öğün adı boş olamaz.")
            .MaximumLength(100).WithMessage("Öğün adı en fazla 100 karakter olabilir.");

        RuleFor(v => v.Foods)
            .NotEmpty().WithMessage("Yiyecekler alanı boş olamaz.")
            .MaximumLength(1000).WithMessage("Yiyecekler alanı en fazla 1000 karakter olabilir.");
    }
}
