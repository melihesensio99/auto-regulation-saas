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

public class WorkoutExerciseDtoValidator : AbstractValidator<WorkoutExerciseDto>
{
    private readonly string[] _validDays = { "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar" };

    public WorkoutExerciseDtoValidator()
    {
        RuleFor(v => v.DayName)
            .NotEmpty().WithMessage("Gün adı boş olamaz.")
            .Must(day => _validDays.Contains(day))
            .WithMessage("Geçerli bir gün adı giriniz (Örn: Pazartesi, Salı, Çarşamba...).");

        RuleFor(v => v.ExerciseName)
            .NotEmpty().WithMessage("Egzersiz adı boş olamaz.")
            .MaximumLength(100).WithMessage("Egzersiz adı en fazla 100 karakter olabilir.");

        RuleFor(v => v.Sets)
            .GreaterThan(0).WithMessage("Set sayısı 0'dan büyük olmalıdır.");

        // Tekrar (Reps) alanı için: "6", "6-8", "3x6", "3x6-8" gibi formatlara izin verelim
        RuleFor(v => v.Reps)
            .NotEmpty().WithMessage("Tekrar alanı boş olamaz.")
            .Matches(@"^(\d+x)?\d+(-\d+)?$")
            .WithMessage("Tekrar alanı geçerli bir formatta olmalıdır. Örn: '8', '6-8', '3x8', '3x6-8' vb.");

        RuleFor(v => v.RestTimeInSeconds)
            .GreaterThanOrEqualTo(0).WithMessage("Dinlenme süresi 0'dan küçük olamaz.");
    }
}
