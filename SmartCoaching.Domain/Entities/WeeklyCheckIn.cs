using System;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Domain.Entities;

public class WeeklyCheckIn : BaseEntity
{
    public Guid AthleteId { get; private set; }
    public Athlete Athlete { get; private set; }

    public DateTime Date { get; private set; }
    public decimal WeightKg { get; private set; }
    
    // Fotoğraflar için URL'ler (AWS S3 vb. yerlerden gelecek string linkler)
    public string? FrontPhotoUrl { get; private set; }
    public string? BackPhotoUrl { get; private set; }
    public string? SidePhotoUrl { get; private set; }
    
    // Antrenör pazar günü bu check-in'i incelerse buraya yorum yazabilir.
    public string? CoachFeedback { get; private set; }

    private WeeklyCheckIn() { } // EF Core için

    public WeeklyCheckIn(Guid athleteId, DateTime date, decimal weightKg, string? frontPhotoUrl, string? backPhotoUrl, string? sidePhotoUrl)
    {
        AthleteId = athleteId;
        Date = date;
        WeightKg = weightKg;
        FrontPhotoUrl = frontPhotoUrl;
        BackPhotoUrl = backPhotoUrl;
        SidePhotoUrl = sidePhotoUrl;
    }

    public void AddCoachFeedback(string feedback)
    {
        CoachFeedback = feedback;
        UpdatedAt = DateTime.UtcNow;
    }
}
