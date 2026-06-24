namespace SmartCoaching.Application.Features.Athletes.Commands.AssignDietProgram;

public class DietMealDto
{
    public int Order { get; set; }
    public string MealName { get; set; } = default!;
    public string Foods { get; set; } = default!;
    public string Notes { get; set; } = default!;
    public int Protein { get; set; }
    public int Carbs { get; set; }
    public int Fats { get; set; }
    public int Calories { get; set; }
}
