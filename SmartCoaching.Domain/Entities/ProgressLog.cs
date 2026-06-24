using System;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Domain.Entities;

public class ProgressLog : BaseEntity
{
    public Guid AthleteId { get; private set; }
    public Athlete Athlete { get; private set; } = null!;

    public DateTime Date { get; private set; }

    // Günlük Metrikler
    public decimal ConsumedCalories { get; private set; }
    public int TakenSteps { get; private set; }
    public bool IsWorkoutCompleted { get; private set; }
    public double? WeightKg { get; private set; }
    public string? Notes { get; private set; }

    // Haftalık/Fotoğraflı Form Check Metrikleri (Opsiyonel)
    public string? FrontPhotoUrl { get; private set; }
    public string? BackPhotoUrl { get; private set; }
    public string? SidePhotoUrl { get; private set; }
    public string? CoachFeedback { get; private set; }
    public string? AiAnalysis { get; private set; }

    private ProgressLog() { }

    private ProgressLog(Guid athleteId, DateTime date, decimal consumedCalories, int takenSteps, bool isWorkoutCompleted, double? weightKg, string? notes, string? frontPhotoUrl, string? backPhotoUrl, string? sidePhotoUrl)
    {
        AthleteId = athleteId;
        Date = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
        ConsumedCalories = consumedCalories;
        TakenSteps = takenSteps;
        IsWorkoutCompleted = isWorkoutCompleted;
        WeightKg = weightKg;
        Notes = notes;
        FrontPhotoUrl = frontPhotoUrl;
        BackPhotoUrl = backPhotoUrl;
        SidePhotoUrl = sidePhotoUrl;
    }

    public static ProgressLog Create(Guid athleteId, DateTime date, decimal consumedCalories, int takenSteps, bool isWorkoutCompleted, double? weightKg, string? notes, string? frontPhotoUrl, string? backPhotoUrl, string? sidePhotoUrl)
    {
        return new ProgressLog(athleteId, date, consumedCalories, takenSteps, isWorkoutCompleted, weightKg, notes, frontPhotoUrl, backPhotoUrl, sidePhotoUrl);
    }

    public void UpdateMetrics(decimal consumedCalories, int takenSteps, bool isWorkoutCompleted, double? weightKg, string? notes, string? frontPhotoUrl, string? backPhotoUrl, string? sidePhotoUrl)
    {
        ConsumedCalories = consumedCalories;
        TakenSteps = takenSteps;
        IsWorkoutCompleted = isWorkoutCompleted;
        if (weightKg.HasValue) WeightKg = weightKg; // Eğer yeni değer gelmişse güncelle
        if (!string.IsNullOrEmpty(notes)) Notes = notes;

        // Eğer yeni fotoğraflar geldiyse eskisini ez
        if (!string.IsNullOrEmpty(frontPhotoUrl)) FrontPhotoUrl = frontPhotoUrl;
        if (!string.IsNullOrEmpty(backPhotoUrl)) BackPhotoUrl = backPhotoUrl;
        if (!string.IsNullOrEmpty(sidePhotoUrl)) SidePhotoUrl = sidePhotoUrl;

        UpdatedAt = DateTime.UtcNow;
    }

    public void AddCoachFeedback(string feedback)
    {
        CoachFeedback = feedback;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetAiAnalysis(string analysis)
    {
        AiAnalysis = analysis;
        UpdatedAt = DateTime.UtcNow;
    }

    // Fotoğraf içeriyorsa bu kaydın aynı zamanda bir form check-in (haftalık/aylık vb) olduğunu belirten yardımcı metot.
    public bool HasPhotos()
    {
        return !string.IsNullOrEmpty(FrontPhotoUrl) || 
               !string.IsNullOrEmpty(BackPhotoUrl) || 
               !string.IsNullOrEmpty(SidePhotoUrl);
    }
}
