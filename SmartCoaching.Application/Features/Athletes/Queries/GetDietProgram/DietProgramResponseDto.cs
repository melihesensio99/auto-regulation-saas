using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetDietProgram;

public record DietProgramResponseDto(
    Guid AthleteId,
    string GeneralDietNotes,
    List<DietMealResponseDto> Meals
);

public record DietMealResponseDto(
    Guid Id,
    int Order,
    string MealName,
    string Foods,
    string Notes,
    int Protein,
    int Carbs,
    int Fats,
    int Calories
);
