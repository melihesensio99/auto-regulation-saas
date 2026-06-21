using FluentValidation;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteProgress;

public class GetAthleteProgressQueryValidator : AbstractValidator<GetAthleteProgressQuery>
{
    public GetAthleteProgressQueryValidator()
    {
        RuleFor(x => x.AthleteId)
            .NotEmpty().WithMessage("Sporcu ID'si gereklidir.");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Başlangıç tarihi gereklidir.");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("Bitiş tarihi gereklidir.")
            .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("Bitiş tarihi, başlangıç tarihinden önce olamaz.");
    }
}
