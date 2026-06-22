using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Domain.Entities;

public class DailyProgress : BaseEntity
{
    public Guid AthleteId { get; private set; }
    public Athlete Athlete { get; private set; }

    public DateTime Date { get; private set; }
    public decimal ConsumedCalories { get; private set; }
    public int TakenSteps { get; private set; }
    public double? WeightKg { get; private set; }
    public string? Notes { get; private set; }

    private DailyProgress() { } // EF Core gereksinimi

    private DailyProgress(Guid athleteId, DateTime date, decimal consumedCalories, int takenSteps, double? weightKg, string? notes)
    {
        AthleteId = athleteId;
        Date = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
        ConsumedCalories = consumedCalories;
        TakenSteps = takenSteps;
        WeightKg = weightKg;
        Notes = notes;
    }

    public static DailyProgress Create(Guid athleteId, DateTime date, decimal consumedCalories, int takenSteps, double? weightKg, string? notes)
    {
        return new DailyProgress(athleteId, date, consumedCalories, takenSteps, weightKg, notes);
    }

    public void UpdateMetrics(decimal consumedCalories, int takenSteps, double? weightKg, string? notes)
    {
        ConsumedCalories = consumedCalories;
        TakenSteps = takenSteps;
        WeightKg = weightKg;
        Notes = notes;
        UpdatedAt = DateTime.UtcNow;
    }
}
