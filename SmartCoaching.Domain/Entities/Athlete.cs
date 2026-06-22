using SmartCoaching.Domain.Common;

namespace SmartCoaching.Domain.Entities;

public class Athlete : BaseEntity
{
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    
    // Multi-tenancy: Bu sporcu hangi antrenöre (kiracıya) ait?
    public Guid CoachId { get; private set; } 
    public Coach Coach { get; private set; }

    public DateTime DateOfBirth { get; private set; }
    public double HeightCm { get; private set; }
    public double StartingWeightKg { get; private set; }
    public decimal TargetCalories { get; private set; }
    public int TargetSteps { get; private set; }

    // 1-N İlişki: Bir sporcunun birden fazla günlük gelişimi olabilir
    private readonly List<DailyProgress> _dailyProgresses = new();
    public IReadOnlyCollection<DailyProgress> DailyProgresses => _dailyProgresses.AsReadOnly();

    // 1-N İlişki: Bir sporcunun birden fazla haftalık form kontrolü olabilir
    private readonly List<WeeklyCheckIn> _weeklyCheckIns = new();
    public IReadOnlyCollection<WeeklyCheckIn> WeeklyCheckIns => _weeklyCheckIns.AsReadOnly();

    private Athlete() { } // EF Core için

    private Athlete(Guid id, string firstName, string lastName, string email, string passwordHash, DateTime dateOfBirth, double heightCm, double startingWeightKg, Guid coachId)
    {
        Id = id;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PasswordHash = passwordHash;
        DateOfBirth = dateOfBirth.ToUniversalTime();
        HeightCm = heightCm;
        StartingWeightKg = startingWeightKg;
        CoachId = coachId;
    }

    public static Athlete Create(string firstName, string lastName, string email, string passwordHash, DateTime dateOfBirth, double heightCm, double startingWeightKg, Guid coachId)
    {
        return new Athlete(Guid.NewGuid(), firstName, lastName, email, passwordHash, dateOfBirth, heightCm, startingWeightKg, coachId);
    }

    public void UpdateTargets(decimal calories, int steps)
    {
        TargetCalories = calories;
        TargetSteps = steps;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePassword(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddDailyProgress(DailyProgress progress)
    {
        _dailyProgresses.Add(progress);
    }

    public void AddWeeklyCheckIn(WeeklyCheckIn checkIn)
    {
        _weeklyCheckIns.Add(checkIn);
    }
}
