using MediatR;
using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetWorkoutProgram;

public record GetAthleteWorkoutProgramQuery(Guid AthleteId) : IRequest<Result<AthleteWorkoutProgramDto>>;
