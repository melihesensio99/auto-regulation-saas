using FluentValidation;
using System.Linq;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignWorkoutProgram;

public class AssignWorkoutProgramCommandValidator : AbstractValidator<AssignWorkoutProgramCommand>
{
    public AssignWorkoutProgramCommandValidator()
    {
        RuleFor(v => v.AthleteId)
            .NotEmpty().WithMessage("Sporcu ID'si boş olamaz.");

        RuleFor(v => v.Exercises)
            .NotNull().WithMessage("Egzersiz listesi boş olamaz.");

        RuleForEach(v => v.Exercises).SetValidator(new WorkoutExerciseDtoValidator());
    }
}

