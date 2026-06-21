using MediatR;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Application.Features.Auth.Commands.Login;

public record LoginCoachCommand(string Email, string Password) : IRequest<Result<string>>;
