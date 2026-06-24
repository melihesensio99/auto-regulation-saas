using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Domain.Entities;

public class DietMeal : BaseEntity
{
    public Guid AthleteId { get; set; }
    public Athlete Athlete { get; set; }

    public int Order { get; set; }
    public string MealName { get; set; } = string.Empty;
    public string Foods { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;

    // Macro values (Calculated by AI or entered manually)
    public int Protein { get; set; }
    public int Carbs { get; set; }
    public int Fats { get; set; }
    public int Calories { get; set; }
}
