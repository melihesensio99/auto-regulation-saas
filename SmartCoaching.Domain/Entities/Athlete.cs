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
    public Coach Coach { get; private set; } = null!;

    public DateTime? DateOfBirth { get; private set; }
    public double? HeightCm { get; private set; }
    public double? StartingWeightKg { get; private set; }
    public decimal TargetCalories { get; private set; }
    public int TargetSteps { get; private set; }
    public string GeneralDietNotes { get; private set; } = string.Empty;

    public DateTime SubscriptionStartDate { get; private set; }
    public DateTime SubscriptionEndDate { get; private set; }

    // Onboarding Alanları
    public bool IsOnboardingCompleted { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string? Occupation { get; private set; }
    public string? MainReason { get; private set; }
    public string? ShortTermGoal { get; private set; }
    public string? LongTermGoal { get; private set; }
    public string? Expectations { get; private set; }
    public string? TrainingHistory { get; private set; }
    public string? CurrentTrainingRoutine { get; private set; }
    public string? OutsidePhysicalActivity { get; private set; }
    public string? HasTrackedMacros { get; private set; }
    public string? HasWorkedWithCoach { get; private set; }
    public string? HearAboutUs { get; private set; }
    public string? AdditionalNotes { get; private set; }

    // Spam koruması
    public DateTime? LastProgramNotificationSentAt { get; private set; }

    // 1-N İlişki: Sporcunun tüm gelişim kayıtları (Günlük metrikler + İsteğe bağlı fotoğraflar)
    private readonly List<ProgressLog> _progressLogs = new();
    public IReadOnlyCollection<ProgressLog> ProgressLogs => _progressLogs.AsReadOnly();

    // 1-N İlişki: Sporcunun aktif antrenman programı egzersizleri
    private readonly List<WorkoutExercise> _workoutExercises = new();
    public IReadOnlyCollection<WorkoutExercise> WorkoutExercises => _workoutExercises.AsReadOnly();

    // 1-N İlişki: Sporcunun diyet öğünleri
    private readonly List<DietMeal> _dietMeals = new();
    public IReadOnlyCollection<DietMeal> DietMeals => _dietMeals.AsReadOnly();

    private Athlete() { } // EF Core için

    private Athlete(Guid id, string firstName, string lastName, string email, string passwordHash, Guid coachId, DateTime subscriptionStartDate, DateTime subscriptionEndDate)
    {
        Id = id;
        CoachId = coachId;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PasswordHash = passwordHash;
        IsOnboardingCompleted = false;
        SubscriptionStartDate = DateTime.SpecifyKind(subscriptionStartDate.Date, DateTimeKind.Utc);
        SubscriptionEndDate = DateTime.SpecifyKind(subscriptionEndDate.Date, DateTimeKind.Utc);
        
        // Varsayılan hedefler
        TargetCalories = 2000;
        TargetSteps = 10000;
    }

    public static Athlete Create(string firstName, string lastName, string email, string passwordHash, Guid coachId, DateTime subscriptionEndDate)
    {
        return new Athlete(Guid.NewGuid(), firstName, lastName, email, passwordHash, coachId, DateTime.UtcNow, subscriptionEndDate);
    }

    public void CompleteOnboarding(
        DateTime dateOfBirth, 
        string phoneNumber,
        string occupation,
        string mainReason,
        string shortTermGoal,
        string longTermGoal,
        string expectations,
        double heightCm, 
        double startingWeightKg, 
        string trainingHistory,
        string currentTrainingRoutine,
        string outsidePhysicalActivity,
        string hasTrackedMacros,
        string hasWorkedWithCoach,
        string hearAboutUs,
        string additionalNotes)
    {
        DateOfBirth = DateTime.SpecifyKind(dateOfBirth.Date, DateTimeKind.Utc);
        PhoneNumber = phoneNumber;
        Occupation = occupation;
        MainReason = mainReason;
        ShortTermGoal = shortTermGoal;
        LongTermGoal = longTermGoal;
        Expectations = expectations;
        HeightCm = heightCm;
        StartingWeightKg = startingWeightKg;
        TrainingHistory = trainingHistory;
        CurrentTrainingRoutine = currentTrainingRoutine;
        OutsidePhysicalActivity = outsidePhysicalActivity;
        HasTrackedMacros = hasTrackedMacros;
        HasWorkedWithCoach = hasWorkedWithCoach;
        HearAboutUs = hearAboutUs;
        AdditionalNotes = additionalNotes;
        
        IsOnboardingCompleted = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkProgramNotificationSent()
    {
        LastProgramNotificationSentAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
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

    public void AddProgressLog(ProgressLog log)
    {
        _progressLogs.Add(log);
    }

    public void SetWorkoutExercises(List<WorkoutExercise> exercises)
    {
        _workoutExercises.Clear();
        _workoutExercises.AddRange(exercises);
    }

    public void SetDietMeals(List<DietMeal> meals, string generalDietNotes)
    {
        _dietMeals.Clear();
        _dietMeals.AddRange(meals);
        GeneralDietNotes = generalDietNotes;
        UpdatedAt = DateTime.UtcNow;
    }
}
