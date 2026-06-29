using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartCoaching.Domain.Entities;

namespace SmartCoaching.Infrastructure.Persistence.Seed;

public class ExerciseSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ExerciseSeeder> _logger;

    public ExerciseSeeder(ApplicationDbContext context, ILogger<ExerciseSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            if (await _context.ExerciseLibraries.AnyAsync())
            {
                _logger.LogInformation("Exercise library is already seeded. Checking for missing VideoUrls...");
                var missingVideoCount = await _context.ExerciseLibraries.CountAsync(e => string.IsNullOrEmpty(e.VideoUrl));
                if (missingVideoCount == 0)
                {
                    _logger.LogInformation("All VideoUrls are populated. Skipping seed.");
                    return;
                }
            }

            var jsonPath = Path.Combine(AppContext.BaseDirectory, "Data", "Seed", "exercises.json");
            
            if (!File.Exists(jsonPath))
            {
                var fallbackPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "SmartCoaching.Infrastructure", "Persistence", "Seed", "exercises.json");
                if (File.Exists(fallbackPath))
                {
                    jsonPath = fallbackPath;
                }
            }

            if (!File.Exists(jsonPath))
            {
                _logger.LogWarning($"Exercise dataset not found at {jsonPath}. Skipping seeding.");
                return;
            }

            var jsonContent = await File.ReadAllTextAsync(jsonPath);
            
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var exercisesDto = JsonSerializer.Deserialize<List<ExerciseDto>>(jsonContent, options);

            if (exercisesDto != null && exercisesDto.Any())
            {
                if (await _context.ExerciseLibraries.AnyAsync())
                {
                    var existingLibraries = await _context.ExerciseLibraries.ToListAsync();
                    var dict = exercisesDto.ToDictionary(x => x.Id);
                    foreach(var lib in existingLibraries)
                    {
                        if (string.IsNullOrEmpty(lib.VideoUrl) && dict.TryGetValue(lib.Id, out var dto))
                        {
                            lib.VideoUrl = dto.Video ?? string.Empty;
                        }
                    }
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Successfully updated missing VideoUrls in exercise library.");
                }
                else
                {
                    var entities = exercisesDto.Select(dto => new ExerciseLibrary
                    {
                        Id = dto.Id,
                        Name = dto.Name ?? string.Empty,
                        Category = dto.Category ?? string.Empty,
                        BodyPart = dto.BodyPart ?? string.Empty,
                        Equipment = dto.Equipment ?? string.Empty,
                        TargetMuscle = dto.Target ?? string.Empty,
                        InstructionsEn = dto.Instructions?.En ?? string.Empty,
                        InstructionsTr = dto.Instructions?.Tr ?? string.Empty,
                        ImageUrl = dto.Image ?? string.Empty,
                        VideoUrl = dto.Video ?? string.Empty
                    });

                    await _context.ExerciseLibraries.AddRangeAsync(entities);
                    await _context.SaveChangesAsync();
                    
                    _logger.LogInformation($"Successfully seeded {exercisesDto.Count} exercises.");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the exercise library.");
        }
    }

    private class ExerciseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        [JsonPropertyName("body_part")]
        public string BodyPart { get; set; } = string.Empty;
        public string Equipment { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        [JsonPropertyName("image")]
        public string Image { get; set; } = string.Empty;
        [JsonPropertyName("gif_url")]
        public string Video { get; set; } = string.Empty;
        public InstructionsDto? Instructions { get; set; }
    }

    private class InstructionsDto
    {
        public string En { get; set; } = string.Empty;
        public string Tr { get; set; } = string.Empty;
    }
}
