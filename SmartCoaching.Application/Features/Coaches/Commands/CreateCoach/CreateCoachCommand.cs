using MediatR;
using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Application.Features.Coaches.Commands.CreateCoach;

public record CreateCoachCommand(
    string FirstName,
    string LastName,
    string Email,
    string Password) : IRequest<Result<Guid>>;
