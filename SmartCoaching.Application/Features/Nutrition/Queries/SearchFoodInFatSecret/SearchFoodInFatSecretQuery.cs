using MediatR;
using SmartCoaching.Application.Common.Interfaces;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Nutrition.Queries.SearchFoodInFatSecret;

public record SearchFoodInFatSecretQuery(string Query) : IRequest<List<FatSecretFoodItem>>;

public class SearchFoodInFatSecretQueryHandler : IRequestHandler<SearchFoodInFatSecretQuery, List<FatSecretFoodItem>>
{
    private readonly IFatSecretService _fatSecretService;

    public SearchFoodInFatSecretQueryHandler(IFatSecretService fatSecretService)
    {
        _fatSecretService = fatSecretService;
    }

    public async Task<List<FatSecretFoodItem>> Handle(SearchFoodInFatSecretQuery request, CancellationToken cancellationToken)
    {
        return await _fatSecretService.SearchFoodAsync(request.Query);
    }
}
