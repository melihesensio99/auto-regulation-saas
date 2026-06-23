using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Constants;
using SmartCoaching.Domain.Entities;

namespace SmartCoaching.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    private readonly ICurrentUserService _currentUserService;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ICurrentUserService currentUserService)
        : base(options)
    {
        _currentUserService = currentUserService;
    }

    public DbSet<Coach> Coaches => Set<Coach>();
    public DbSet<Athlete> Athletes => Set<Athlete>();
    public DbSet<DailyProgress> DailyProgresses { get; set; }
    public DbSet<WeeklyCheckIn> WeeklyCheckIns { get; set; }
    public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
    public DbSet<DietMeal> DietMeals { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Coach - Athlete İlişkisi (1'e Çok / One-to-Many)
        modelBuilder.Entity<Coach>()
            .HasMany(c => c.Athletes)
            .WithOne(a => a.Coach)
            .HasForeignKey(a => a.CoachId)
            .OnDelete(DeleteBehavior.Cascade); // Antrenör silinirse sporcuları da silinsin

        // Email alanını veritabanında benzersiz (unique) yapalım
        modelBuilder.Entity<Coach>()
            .HasIndex(c => c.Email)
            .IsUnique();

        // Athlete - DailyProgress İlişkisi (1'e Çok)
        modelBuilder.Entity<Athlete>()
            .HasMany(a => a.DailyProgresses)
            .WithOne(dp => dp.Athlete)
            .HasForeignKey(dp => dp.AthleteId)
            .OnDelete(DeleteBehavior.Cascade);

        // Athlete - WeeklyCheckIn İlişkisi (1'e Çok)
        modelBuilder.Entity<Athlete>()
            .HasMany(a => a.WeeklyCheckIns)
            .WithOne(w => w.Athlete)
            .HasForeignKey(w => w.AthleteId)
            .OnDelete(DeleteBehavior.Cascade);

        // Athlete - WorkoutExercise İlişkisi (1'e Çok)
        modelBuilder.Entity<Athlete>()
            .HasMany(a => a.WorkoutExercises)
            .WithOne(we => we.Athlete)
            .HasForeignKey(we => we.AthleteId)
            .OnDelete(DeleteBehavior.Cascade);

        // MULTI-TENANCY: Global Query Filters
        // Athlete entity has the master CoachId check.
        modelBuilder.Entity<Athlete>().HasQueryFilter(a => 
            _currentUserService.TenantId == Guid.Empty || 
            (_currentUserService.Role == Roles.Coach && a.CoachId == _currentUserService.TenantId) || 
            (_currentUserService.Role == Roles.Athlete && a.Id == _currentUserService.TenantId));
            
        // Removed child entity query filters completely to prevent Npgsql UPDATE bugs.
        // Handlers already protect access by checking the Athlete first.
    }
}
