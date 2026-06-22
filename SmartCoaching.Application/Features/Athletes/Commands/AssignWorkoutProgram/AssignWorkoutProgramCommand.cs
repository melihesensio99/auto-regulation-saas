using MediatR;
using SmartCoaching.Domain.Common;
using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignWorkoutProgram;

public record AssignWorkoutProgramCommand(
    Guid AthleteId,
    List<WorkoutExerciseDto> Exercises
) : IRequest<Result<Guid>>;
