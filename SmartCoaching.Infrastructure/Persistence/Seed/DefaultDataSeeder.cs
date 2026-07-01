using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartCoaching.Domain.Entities;
using SmartCoaching.Application.Common.Interfaces;

namespace SmartCoaching.Infrastructure.Persistence.Seed;

public class DefaultDataSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DefaultDataSeeder> _logger;
    private readonly IPasswordHasher _passwordHasher;

    public DefaultDataSeeder(ApplicationDbContext context, ILogger<DefaultDataSeeder> logger, IPasswordHasher passwordHasher)
    {
        _context = context;
        _logger = logger;
        _passwordHasher = passwordHasher;
    }

    public async Task SeedAsync()
    {
        try
        {
            if (!await _context.Coaches.AnyAsync())
            {
                _logger.LogInformation("Seeding default coach...");
                
                var coachId = Guid.NewGuid();
                var passwordHash = _passwordHasher.Hash("Password123!");
                
                var coach = new Coach(
                    "Test",
                    "Coach",
                    "coach@example.com",
                    passwordHash
                );

                await _context.Coaches.AddAsync(coach);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Default coach seeded: coach@example.com / Password123!");

                // Seed a default athlete for this coach
                if (!await _context.Athletes.AnyAsync())
                {
                    _logger.LogInformation("Seeding default athlete...");
                    var athletePasswordHash = _passwordHasher.Hash("Password123!");
                    var athlete = Athlete.Create(
                        "Alex",
                        "Mitchell",
                        "alex@example.com",
                        athletePasswordHash,
                        coach.Id,
                        DateTime.UtcNow.AddMonths(3)
                    );
                    
                    await _context.Athletes.AddAsync(athlete);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Default athlete seeded: alex@example.com / Password123!");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the default data.");
        }
    }
}
