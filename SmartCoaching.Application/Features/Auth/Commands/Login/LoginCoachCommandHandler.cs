using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Auth.Commands.Login;

public class LoginCoachCommandHandler : IRequestHandler<LoginCoachCommand, Result<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public LoginCoachCommandHandler(IApplicationDbContext context, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<Result<string>> Handle(LoginCoachCommand request, CancellationToken cancellationToken)
    {
        var coach = await _context.Coaches.SingleOrDefaultAsync(c => c.Email == request.Email, cancellationToken);

        if (coach is null)
        {
            return Result.Failure<string>(new Error("Auth.InvalidCredentials", "E-posta veya şifre hatalı.", ErrorType.Unauthorized));
        }

        bool isPasswordValid = _passwordHasher.Verify(request.Password, coach.PasswordHash);

        if (!isPasswordValid)
        {
            return Result.Failure<string>(new Error("Auth.InvalidCredentials", "E-posta veya şifre hatalı.", ErrorType.Unauthorized));
        }

        string token = _jwtProvider.Generate(coach);

        return Result.Success(token);
    }
}
