using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Commands.AssignDietProgram;

public class AssignDietProgramRequestDto
{
    public string GeneralDietNotes { get; set; } = string.Empty;
    public List<DietMealDto> Meals { get; set; } = new();
}
