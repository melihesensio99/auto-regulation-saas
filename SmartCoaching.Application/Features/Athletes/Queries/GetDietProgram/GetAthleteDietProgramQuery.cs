using MediatR;
using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetDietProgram;

public class GetAthleteDietProgramQuery : IRequest<Result<DietProgramResponseDto>>
{
    public Guid AthleteId { get; set; }

    public GetAthleteDietProgramQuery(Guid athleteId)
    {
        AthleteId = athleteId;
    }
}
