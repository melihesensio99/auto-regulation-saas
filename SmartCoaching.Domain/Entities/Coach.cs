using SmartCoaching.Domain.Common;

namespace SmartCoaching.Domain.Entities;

public class Coach : BaseEntity
{
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    
    // Multi-tenancy mantığı: Her Coach aslında sistemde bir "Tenant" (Kiracı) sayılır.
    // O yüzden TenantId aslında Coach'un kendi Id'si olacak.
    public Guid TenantId => Id; 

    // İlişkiler
    public IReadOnlyCollection<Athlete> Athletes => _athletes.AsReadOnly();
    private readonly List<Athlete> _athletes = new();

    private Coach() { } // EF Core için

    public Coach(string firstName, string lastName, string email, string passwordHash)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PasswordHash = passwordHash;
    }

    public void AddAthlete(Athlete athlete)
    {
        _athletes.Add(athlete);
    }
}
