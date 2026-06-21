using FluentValidation;

namespace SmartCoaching.Application.Features.Auth.Commands.Login;

public class LoginCoachCommandValidator : AbstractValidator<LoginCoachCommand>
{
    public LoginCoachCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}
