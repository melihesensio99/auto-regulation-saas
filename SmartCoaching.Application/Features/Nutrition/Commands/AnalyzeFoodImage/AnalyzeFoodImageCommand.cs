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
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            return JsonSerializer.Deserialize<AnalyzedFoodDto>(jsonResponse, options);
        }
        catch
        {
            return null;
        }
    }
}
