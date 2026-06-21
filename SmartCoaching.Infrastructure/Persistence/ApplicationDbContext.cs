using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Entities;

namespace SmartCoaching.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Coach> Coaches { get; set; }
    public DbSet<Athlete> Athletes { get; set; }
    public DbSet<DailyMetric> DailyMetrics { get; set; }

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
    }
}
