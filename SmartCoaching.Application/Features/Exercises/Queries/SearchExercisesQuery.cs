using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Entities;

namespace SmartCoaching.Application.Features.Exercises.Queries;

public record SearchExercisesQuery(string Query) : IRequest<List<ExerciseLibraryDto>>;

public class ExerciseLibraryDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string TargetMuscle { get; init; } = string.Empty;
    public string ImageUrl { get; init; } = string.Empty;
    public string GifUrl { get; init; } = string.Empty;
}

public class SearchExercisesQueryHandler : IRequestHandler<SearchExercisesQuery, List<ExerciseLibraryDto>>
{
    private readonly IApplicationDbContext _context;

    public SearchExercisesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ExerciseLibraryDto>> Handle(SearchExercisesQuery request, CancellationToken cancellationToken)
    {
        var q = request.Query?.Trim().ToLower() ?? string.Empty;

        var query = _context.ExerciseLibraries.AsNoTracking();

        if (!string.IsNullOrEmpty(q))
        {
            query = query.Where(e => e.Name.ToLower().Contains(q) || e.TargetMuscle.ToLower().Contains(q));
        }

        return await query
            .Take(20)
            .Select(e => new ExerciseLibraryDto
            {
                Id = e.Id,
                Name = e.Name,
                TargetMuscle = e.TargetMuscle,
                ImageUrl = e.ImageUrl,
                GifUrl = e.VideoUrl
            })
            .ToListAsync(cancellationToken);
    }
}
