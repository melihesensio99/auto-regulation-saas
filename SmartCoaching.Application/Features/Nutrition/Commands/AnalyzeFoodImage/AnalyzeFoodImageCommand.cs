using MediatR;
using SmartCoaching.Application.Common.Interfaces;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Nutrition.Commands.AnalyzeFoodImage;

public record AnalyzeFoodImageCommand(string Base64Image) : IRequest<AnalyzedFoodDto?>;

public class AnalyzedFoodDto
{
    public string FoodName { get; set; } = string.Empty;
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fats { get; set; }
    public int EstimatedGrams { get; set; }
}

public class AnalyzeFoodImageCommandHandler : IRequestHandler<AnalyzeFoodImageCommand, AnalyzedFoodDto?>
{
    private readonly IAiService _aiService;

    public AnalyzeFoodImageCommandHandler(IAiService aiService)
    {
        _aiService = aiService;
    }

    public async Task<AnalyzedFoodDto?> Handle(AnalyzeFoodImageCommand request, CancellationToken cancellationToken)
    {
        var jsonResponse = await _aiService.EstimateFoodFromImageAsync(request.Base64Image, cancellationToken);
        
        if (string.IsNullOrWhiteSpace(jsonResponse) || jsonResponse == "{}")
            return null;

        try
        {
            using var doc = JsonDocument.Parse(jsonResponse);
            var root = doc.RootElement;
            
            var dto = new AnalyzedFoodDto();
            
            if (root.TryGetProperty("FoodName", out var nameProp)) dto.FoodName = nameProp.GetString() ?? "Bilinmeyen Yemek";
            if (root.TryGetProperty("EstimatedGrams", out var gramsProp) && gramsProp.TryGetInt32(out var grams)) dto.EstimatedGrams = grams;
            if (root.TryGetProperty("Calories", out var calsProp) && calsProp.TryGetDecimal(out var cals)) dto.Calories = cals;
            
            // Check flat properties
            if (root.TryGetProperty("Protein", out var protProp) && protProp.TryGetDecimal(out var prot)) dto.Protein = prot;
            if (root.TryGetProperty("Carbs", out var carbsProp) && carbsProp.TryGetDecimal(out var carbs)) dto.Carbs = carbs;
            if (root.TryGetProperty("Fats", out var fatsProp) && fatsProp.TryGetDecimal(out var fats)) dto.Fats = fats;
            
            // Fallback for nested "Macros" object
            if (dto.Protein == 0 && root.TryGetProperty("Macros", out var macrosProp) && macrosProp.ValueKind == JsonValueKind.Object)
            {
                dto.Protein = GetDecimalValue(macrosProp, "Protein");
                dto.Carbs = GetDecimalValue(macrosProp, "Carbs");
                dto.Fats = GetDecimalValue(macrosProp, "Fats");
            }
            
            // Re-check flat if still 0
            if (dto.Protein == 0)
            {
                dto.Protein = GetDecimalValue(root, "Protein");
                dto.Carbs = GetDecimalValue(root, "Carbs");
                dto.Fats = GetDecimalValue(root, "Fats");
            }

            return dto;
        }
        catch
        {
            return null;
        }
    }

    private decimal GetDecimalValue(JsonElement element, string propertyName)
    {
        if (element.TryGetProperty(propertyName, out var prop))
        {
            if (prop.ValueKind == JsonValueKind.Number && prop.TryGetDecimal(out var dec))
                return dec;
            
            if (prop.ValueKind == JsonValueKind.String)
            {
                var str = prop.GetString()?.Replace("g", "").Replace("G", "").Trim();
                if (decimal.TryParse(str, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var parsedDec))
                    return parsedDec;
            }
        }
        return 0;
    }
}
