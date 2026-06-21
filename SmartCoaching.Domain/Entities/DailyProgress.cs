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
    public string? Notes { get; private set; }

    private DailyProgress() { } // EF Core gereksinimi

    public DailyProgress(Guid athleteId, DateTime date, decimal consumedCalories, int takenSteps, string? notes)
    {
        AthleteId = athleteId;
        Date = date.Date; // Sadece tarihi baz al (saati 00:00:00 yap)
        ConsumedCalories = consumedCalories;
        TakenSteps = takenSteps;
        Notes = notes;
    }

    public void UpdateMetrics(decimal consumedCalories, int takenSteps, string? notes)
    {
        ConsumedCalories = consumedCalories;
        TakenSteps = takenSteps;
        Notes = notes;
        UpdatedAt = DateTime.UtcNow;
    }
}
