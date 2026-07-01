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
    string Source,
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
        // Yalnızca Athlete kendisi ekleyebilir (veya Coach da ekleyebilir, basitleştirmek için AthleteId = TenantId diyoruz)
        var athleteId = _currentUserService.TenantId;

        var consumedFood = ConsumedFood.Create(
            athleteId,
            request.Date,
            request.FoodName,
            request.Calories,
            request.Protein,
            request.Carbs,
            request.Fats,
            request.Source,
            request.ImageUrl,
            request.ExternalId
        );

        _context.ConsumedFoods.Add(consumedFood);
        await _context.SaveChangesAsync(cancellationToken);

        return consumedFood.Id;
    }
}
