using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Nutrition.Queries.GetDailyNutrition;

public record GetDailyNutritionQuery(DateTime Date) : IRequest<DailyNutritionDto>;

public class DailyNutritionDto
{
    public DateTime Date { get; set; }
    public decimal TargetCalories { get; set; }
    public decimal TotalConsumedCalories { get; set; }
    public decimal TotalProtein { get; set; }
    public decimal TotalCarbs { get; set; }
    public decimal TotalFats { get; set; }
    public List<ConsumedFoodDto> Foods { get; set; } = new();
}

public class ConsumedFoodDto
{
    public Guid Id { get; set; }
    public string FoodName { get; set; } = string.Empty;
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fats { get; set; }
    public string Source { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}

public class GetDailyNutritionQueryHandler : IRequestHandler<GetDailyNutritionQuery, DailyNutritionDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetDailyNutritionQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<DailyNutritionDto> Handle(GetDailyNutritionQuery request, CancellationToken cancellationToken)
    {
        var athleteId = _currentUserService.TenantId;

        var athlete = await _context.Athletes
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == athleteId, cancellationToken);

        if (athlete == null)
            throw new Exception("Athlete not found");

        var targetDate = request.Date.Date;

        var foods = await _context.ConsumedFoods
            .AsNoTracking()
            .Where(f => f.AthleteId == athleteId && f.Date.Date == targetDate)
            .ToListAsync(cancellationToken);

        return new DailyNutritionDto
        {
            Date = targetDate,
            TargetCalories = athlete.TargetCalories,
            TotalConsumedCalories = foods.Sum(f => f.Calories),
            TotalProtein = foods.Sum(f => f.Protein),
            TotalCarbs = foods.Sum(f => f.Carbs),
            TotalFats = foods.Sum(f => f.Fats),
            Foods = foods.Select(f => new ConsumedFoodDto
            {
                Id = f.Id,
                FoodName = f.FoodName,
                Calories = f.Calories,
                Protein = f.Protein,
                Carbs = f.Carbs,
                Fats = f.Fats,
                Source = f.Source,
                ImageUrl = f.ImageUrl
            }).ToList()
        };
    }
}
