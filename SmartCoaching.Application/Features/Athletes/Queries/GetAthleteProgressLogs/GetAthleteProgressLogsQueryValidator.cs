using FluentValidation;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteProgressLogs;

public class GetAthleteProgressLogsQueryValidator : AbstractValidator<GetAthleteProgressLogsQuery>
{
    public GetAthleteProgressLogsQueryValidator()
    {
        RuleFor(x => x.AthleteId)
            .NotEmpty().WithMessage("Sporcu ID boş olamaz.");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Başlangıç tarihi boş olamaz.");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("Bitiş tarihi boş olamaz.")
            .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("Bitiş tarihi, başlangıç tarihinden küçük olamaz.");
    }
}
