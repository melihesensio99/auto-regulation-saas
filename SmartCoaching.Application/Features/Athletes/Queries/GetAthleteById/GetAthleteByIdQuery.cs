using MediatR;
using SmartCoaching.Application.Features.Athletes.Queries.GetAthletes;
using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteById;

public record GetAthleteByIdQuery(Guid AthleteId) : IRequest<Result<AthleteDto>>;
