using MediatR;
using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.CreateAthlete;

public record CreateAthleteCommand(
    string FirstName,
    string LastName,
    DateTime DateOfBirth) : IRequest<Result<Guid>>;

