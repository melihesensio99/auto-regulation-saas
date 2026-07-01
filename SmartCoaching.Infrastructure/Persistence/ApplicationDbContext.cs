using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Constants;
using SmartCoaching.Domain.Entities;
using System;

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
    public DbSet<ProgressLog> ProgressLogs { get; set; }
    public DbSet<DietMeal> DietMeals { get; set; }
    public DbSet<ConsumedFood> ConsumedFoods { get; set; }
    public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
    public DbSet<ExerciseLibrary> ExerciseLibraries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Coach - Athlete İlişkisi (1'e Çok / One-to-Many)
        modelBuilder.Entity<Coach>()
            .HasMany(c => c.Athletes)
            .WithOne(a => a.Coach)
            .HasForeignKey(a => a.CoachId)
            .OnDelete(DeleteBehavior.Cascade);

        // Email alanını veritabanında benzersiz (unique) yapalım
        modelBuilder.Entity<Coach>()
            .HasIndex(c => c.Email)
            .IsUnique();

        // Athlete - ProgressLog İlişkisi (1'e Çok)
        modelBuilder.Entity<Athlete>()
            .HasMany(a => a.ProgressLogs)
            .WithOne(pl => pl.Athlete)
            .HasForeignKey(pl => pl.AthleteId)
            .OnDelete(DeleteBehavior.Cascade);

        // Athlete - ConsumedFood İlişkisi (1'e Çok)
        modelBuilder.Entity<Athlete>()
            .HasMany<ConsumedFood>()
            .WithOne(c => c.Athlete)
            .HasForeignKey(c => c.AthleteId)
            .OnDelete(DeleteBehavior.Cascade);

        // Athlete - WorkoutExercise İlişkisi (1'e Çok)
        modelBuilder.Entity<Athlete>()
            .HasMany(a => a.WorkoutExercises)
            .WithOne(w => w.Athlete)
            .HasForeignKey(w => w.AthleteId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WorkoutExercise>()
            .HasOne(w => w.ExerciseLibrary)
            .WithMany()
            .HasForeignKey(w => w.ExerciseLibraryId)
            .OnDelete(DeleteBehavior.SetNull);

        // MULTI-TENANCY: Global Query Filters
        modelBuilder.Entity<Athlete>().HasQueryFilter(a => 
            _currentUserService.TenantId == Guid.Empty || 
            (_currentUserService.Role == Roles.Coach && a.CoachId == _currentUserService.TenantId) || 
            (_currentUserService.Role == Roles.Athlete && a.Id == _currentUserService.TenantId));
    }
}
