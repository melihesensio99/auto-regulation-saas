using System;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Domain.Entities;

public class ConsumedFood : BaseEntity
{
    public Guid AthleteId { get; private set; }
    public Athlete Athlete { get; private set; } = null!;

    public DateTime Date { get; private set; }
    
    public string FoodName { get; private set; }
    public decimal Calories { get; private set; }
    public decimal Protein { get; private set; }
    public decimal Carbs { get; private set; }
    public decimal Fats { get; private set; }
    
    public string? ImageUrl { get; private set; }
    
    // Nereden eklendiği: "Manual", "FatSecret", "AI"
    public string Source { get; private set; } 
    
    // FatSecret üzerinden geliyorsa harici ID
    public string? ExternalId { get; private set; }

    private ConsumedFood() { } // EF Core için

    private ConsumedFood(Guid athleteId, DateTime date, string foodName, decimal calories, decimal protein, decimal carbs, decimal fats, string source, string? imageUrl, string? externalId)
    {
        AthleteId = athleteId;
        Date = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
        FoodName = foodName;
        Calories = calories;
        Protein = protein;
        Carbs = carbs;
        Fats = fats;
        Source = source;
        ImageUrl = imageUrl;
        ExternalId = externalId;
    }

    public static ConsumedFood Create(Guid athleteId, DateTime date, string foodName, decimal calories, decimal protein, decimal carbs, decimal fats, string source, string? imageUrl = null, string? externalId = null)
    {
        return new ConsumedFood(athleteId, date, foodName, calories, protein, carbs, fats, source, imageUrl, externalId);
    }
}
