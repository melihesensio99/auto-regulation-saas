using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Auth.Commands.ChangePassword;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Result<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public ChangePasswordCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider)
    {
        _context = context;
        _currentUserService = currentUserService;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<Result<string>> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !System.Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<string>(new Error("Auth.Unauthorized", "Geçerli bir kullanıcı bulunamadı.", ErrorType.Unauthorized));
        }

        var athlete = await _context.Athletes.IgnoreQueryFilters().SingleOrDefaultAsync(a => a.Id == userId, cancellationToken);
        if (athlete == null)
        {
            return Result.Failure<string>(new Error("Auth.UserNotFound", "Kullanıcı bulunamadı.", ErrorType.NotFound));
        }

        bool isOldPasswordValid = _passwordHasher.Verify(request.OldPassword, athlete.PasswordHash);
        if (!isOldPasswordValid)
        {
            return Result.Failure<string>(new Error("Auth.InvalidOldPassword", "Eski şifre hatalı.", ErrorType.Validation));
        }

        var newPasswordHash = _passwordHasher.Hash(request.NewPassword);
        athlete.UpdatePassword(newPasswordHash);

        await _context.SaveChangesAsync(cancellationToken);

        var refreshedToken = _jwtProvider.GenerateForAthlete(athlete);
        return Result.Success(refreshedToken);
    }
}
