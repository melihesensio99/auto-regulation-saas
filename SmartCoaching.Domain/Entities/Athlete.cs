using SmartCoaching.Domain.Common;

namespace SmartCoaching.Domain.Entities;

public class Athlete : BaseEntity
{
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    
    // Multi-tenancy: Bu sporcu hangi antrenöre (kiracıya) ait?
    public Guid CoachId { get; private set; } 
    public Coach Coach { get; private set; }

    public DateTime DateOfBirth { get; private set; }
    public decimal TargetCalories { get; private set; }
    public int TargetSteps { get; private set; }

    private Athlete() { } // EF Core için

    public Athlete(string firstName, string lastName, Guid coachId, DateTime dateOfBirth)
    {
        FirstName = firstName;
        LastName = lastName;
        CoachId = coachId;
        DateOfBirth = dateOfBirth;
    }

    public void UpdateTargets(decimal calories, int steps)
    {
        TargetCalories = calories;
        TargetSteps = steps;
        UpdatedAt = DateTime.UtcNow;
    }
}
