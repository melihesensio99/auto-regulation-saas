using System;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetDietProgram;

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
