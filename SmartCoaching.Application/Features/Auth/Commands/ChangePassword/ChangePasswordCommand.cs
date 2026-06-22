using MediatR;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Application.Features.Auth.Commands.ChangePassword;

public record ChangePasswordCommand(string OldPassword, string NewPassword) : IRequest<Result<bool>>;
