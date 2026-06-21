using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
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

        // MULTI-TENANCY: Global Query Filter (Küresel Filtre)
        // Eğer sistemde giriş yapmış bir kullanıcı varsa, sorguları sadece o kullanıcının TenantId'sine göre filtrele.
        modelBuilder.Entity<Athlete>()
            .HasQueryFilter(a => _currentUserService.TenantId == Guid.Empty || a.CoachId == _currentUserService.TenantId);
    }
}
