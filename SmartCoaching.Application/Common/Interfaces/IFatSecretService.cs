using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Common.Interfaces;

public class FatSecretFoodItem
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty; // e.g. "Per 100g - Calories: 250kcal | Fat: 10g | Carbs: 30g | Protein: 5g"
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fats { get; set; }
}

public interface IFatSecretService
{
    Task<List<FatSecretFoodItem>> SearchFoodAsync(string query);
}
