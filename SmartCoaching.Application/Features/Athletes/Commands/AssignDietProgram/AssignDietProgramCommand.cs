using MediatR;
using SmartCoaching.Domain.Common;
using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignDietProgram;

public class AssignDietProgramCommand : IRequest<Result<Guid>>
{
    public Guid AthleteId { get; set; }
    public string GeneralDietNotes { get; set; } = string.Empty;
    public List<DietMealDto> Meals { get; set; } = new();
}

public class AssignDietProgramRequestDto
{
    public string GeneralDietNotes { get; set; } = string.Empty;
    public List<DietMealDto> Meals { get; set; } = new();
}
