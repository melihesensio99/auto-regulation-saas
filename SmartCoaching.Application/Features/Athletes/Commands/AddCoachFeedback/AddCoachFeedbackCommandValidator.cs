using FluentValidation;

namespace SmartCoaching.Application.Features.Athletes.Commands.AddCoachFeedback;

public class AddCoachFeedbackCommandValidator : AbstractValidator<AddCoachFeedbackCommand>
{
    public AddCoachFeedbackCommandValidator()
    {
        RuleFor(x => x.AthleteId)
            .NotEmpty().WithMessage("Sporcu ID boş olamaz.");

        RuleFor(x => x.ProgressLogId)
            .NotEmpty().WithMessage("Gelişim kaydı ID boş olamaz.");

        RuleFor(x => x.Feedback)
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Geri bildirim boş olamaz.")
            .MaximumLength(1000).WithMessage("Geri bildirim en fazla 1000 karakter olabilir.");
    }
}
