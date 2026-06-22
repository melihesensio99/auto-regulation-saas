using MediatR;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Application.Features.Auth.Commands.AthleteLogin;

public record AthleteLoginCommand(string Email, string Password) : IRequest<Result<string>>;
