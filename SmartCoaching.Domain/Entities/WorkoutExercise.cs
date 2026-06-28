using System;

namespace SmartCoaching.Domain.Entities;

public class WorkoutExercise
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AthleteId { get; set; }
    public Athlete Athlete { get; set; } = null!;

    // Hangi gün yapılacak (Örn: "1. Gün", "Push Day")
    public required string DayName { get; set; }
    
    // Egzersiz bilgileri
    public required string ExerciseName { get; set; }
    public int Sets { get; set; }
    public required string Reps { get; set; } // Örn: "6-8 (RIR 2)"
    public int RestTimeInSeconds { get; set; }
    public string? Notes { get; set; }
    
    // Sıralama (Reordering) için indeks
    public int OrderIndex { get; set; }
}
