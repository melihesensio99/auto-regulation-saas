using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetDietProgram;

public record DietProgramResponseDto(
    Guid AthleteId,
    string GeneralDietNotes,
    List<DietMealResponseDto> Meals,
    int TotalCalories,
    int TotalProtein,
    int TotalCarbs,
    int TotalFats
);
