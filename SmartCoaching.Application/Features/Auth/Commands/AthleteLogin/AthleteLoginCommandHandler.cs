using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Auth.Commands.AthleteLogin;

public class AthleteLoginCommandHandler : IRequestHandler<AthleteLoginCommand, Result<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public AthleteLoginCommandHandler(IApplicationDbContext context, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<Result<string>> Handle(AthleteLoginCommand request, CancellationToken cancellationToken)
    {
        // Global Query Filter'ı atlamak zorundayız, çünkü sporcu giriş yaparken CurrentUserService'de henüz TenantId (CoachId) yok!
        var athlete = await _context.Athletes.IgnoreQueryFilters().SingleOrDefaultAsync(a => a.Email == request.Email, cancellationToken);

        if (athlete is null)
        {
            return Result.Failure<string>(new Error("Auth.InvalidCredentials", "E-posta veya şifre hatalı.", ErrorType.Unauthorized));
        }

        bool isPasswordValid = _passwordHasher.Verify(request.Password, athlete.PasswordHash);

        if (!isPasswordValid)
        {
            return Result.Failure<string>(new Error("Auth.InvalidCredentials", "E-posta veya şifre hatalı.", ErrorType.Unauthorized));
        }

        string token = _jwtProvider.GenerateForAthlete(athlete);

        return Result.Success(token);
    }
}
