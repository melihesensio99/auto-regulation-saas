using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetDietProgram;

public record DietProgramResponseDto(
    Guid AthleteId,
    List<DietMealResponseDto> Meals
);

public record DietMealResponseDto(
    Guid Id,
    string MealName,
    string Foods,
    string Notes
);
