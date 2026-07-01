using MediatR;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Nutrition.Commands.LogConsumedFood;

public record LogConsumedFoodCommand(
    DateTime Date,
    string FoodName,
    decimal Calories,
    decimal Protein,
    decimal Carbs,
    decimal Fats,
    string? Source = null,
    string? ImageUrl = null,
    string? ExternalId = null
) : IRequest<Guid>;

public class LogConsumedFoodCommandHandler : IRequestHandler<LogConsumedFoodCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public LogConsumedFoodCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(LogConsumedFoodCommand request, CancellationToken cancellationToken)
    {
        var athleteId = _currentUserService.TenantId;

        var dateToUse = request.Date == default ? DateTime.UtcNow : request.Date;
        var sourceToUse = string.IsNullOrWhiteSpace(request.Source) ? "Manuel" : request.Source;

        var consumedFood = ConsumedFood.Create(
            athleteId,
            dateToUse,
            request.FoodName,
            request.Calories,
            request.Protein,
            request.Carbs,
            request.Fats,
            sourceToUse,
            request.ImageUrl,
            request.ExternalId
        );

        _context.ConsumedFoods.Add(consumedFood);
        await _context.SaveChangesAsync(cancellationToken);

        return consumedFood.Id;
    }
}
