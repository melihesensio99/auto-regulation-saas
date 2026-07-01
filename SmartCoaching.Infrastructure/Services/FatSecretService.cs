using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmartCoaching.Application.Common.Interfaces;

namespace SmartCoaching.Infrastructure.Services;

public class FatSecretService : IFatSecretService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IMemoryCache _cache;
    private readonly ILogger<FatSecretService> _logger;

    public FatSecretService(HttpClient httpClient, IConfiguration configuration, IMemoryCache cache, ILogger<FatSecretService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _cache = cache;
        _logger = logger;
    }

    private async Task<string> GetAccessTokenAsync()
    {
        var cacheKey = "FatSecretAccessToken";
        if (_cache.TryGetValue(cacheKey, out string? cachedToken) && !string.IsNullOrEmpty(cachedToken))
        {
            return cachedToken;
        }

        var clientId = _configuration["FatSecret:ClientId"];
        var clientSecret = _configuration["FatSecret:ClientSecret"];

        if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
        {
            _logger.LogWarning("FatSecret API keys are missing in configuration.");
            return string.Empty;
        }

        var request = new HttpRequestMessage(HttpMethod.Post, "https://oauth.fatsecret.com/connect/token");
        
        var authString = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authString);
        
        request.Content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "client_credentials"),
            new KeyValuePair<string, string>("scope", "basic")
        });

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to get FatSecret token. Status: {StatusCode}", response.StatusCode);
            return string.Empty;
        }

        var content = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(content);
        var token = doc.RootElement.GetProperty("access_token").GetString() ?? string.Empty;
        var expiresIn = doc.RootElement.GetProperty("expires_in").GetInt32();

        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromSeconds(expiresIn - 60)); // Cache slightly less than expiration

        _cache.Set(cacheKey, token, cacheOptions);

        return token;
    }

    public async Task<List<FatSecretFoodItem>> SearchFoodAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new List<FatSecretFoodItem>();

        // Cache arama sonuçları
        var cacheKey = $"FatSecretSearch_{query.ToLowerInvariant()}";
        if (_cache.TryGetValue(cacheKey, out List<FatSecretFoodItem>? cachedResults) && cachedResults != null)
        {
            return cachedResults;
        }

        var token = await GetAccessTokenAsync();
        if (string.IsNullOrEmpty(token))
            return new List<FatSecretFoodItem>();

        var request = new HttpRequestMessage(HttpMethod.Post, "https://platform.fatsecret.com/rest/server.api");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
        request.Content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("method", "foods.search"),
            new KeyValuePair<string, string>("search_expression", query),
            new KeyValuePair<string, string>("format", "json"),
            new KeyValuePair<string, string>("max_results", "10")
        });

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("FatSecret API returned error. Status: {StatusCode}", response.StatusCode);
            return new List<FatSecretFoodItem>();
        }

        var content = await response.Content.ReadAsStringAsync();
        var result = new List<FatSecretFoodItem>();

        try
        {
            using var doc = JsonDocument.Parse(content);
            if (doc.RootElement.TryGetProperty("foods", out var foodsElement) && 
                foodsElement.TryGetProperty("food", out var foodArray))
            {
                if (foodArray.ValueKind == JsonValueKind.Array)
                {
                    foreach (var food in foodArray.EnumerateArray())
                    {
                        var parsed = ParseFoodItem(food);
                        if (parsed != null) result.Add(parsed);
                    }
                }
                else if (foodArray.ValueKind == JsonValueKind.Object)
                {
                    // FatSecret API bazen 1 sonuç varsa array yerine object döner
                    var parsed = ParseFoodItem(foodArray);
                    if (parsed != null) result.Add(parsed);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing FatSecret response.");
        }

        if (result.Count > 0)
        {
            // Sonuçları 24 saat önbellekte tut (rate limit dostu)
            _cache.Set(cacheKey, result, TimeSpan.FromHours(24));
        }

        return result;
    }

    private FatSecretFoodItem? ParseFoodItem(JsonElement food)
    {
        var id = food.GetProperty("food_id").GetString();
        var name = food.GetProperty("food_name").GetString();
        var description = food.GetProperty("food_description").GetString();

        if (id == null || name == null || description == null) return null;

        var item = new FatSecretFoodItem
        {
            Id = id,
            Name = name,
            Description = description
        };

        // Description is usually: "Per 100g - Calories: 250kcal | Fat: 10.00g | Carbs: 30.00g | Protein: 5.00g"
        item.Calories = ExtractDecimal(description, @"Calories:\s*([\d\.]+)kcal");
        item.Fats = ExtractDecimal(description, @"Fat:\s*([\d\.]+)g");
        item.Carbs = ExtractDecimal(description, @"Carbs:\s*([\d\.]+)g");
        item.Protein = ExtractDecimal(description, @"Protein:\s*([\d\.]+)g");

        return item;
    }

    private decimal ExtractDecimal(string text, string pattern)
    {
        var match = Regex.Match(text, pattern, RegexOptions.IgnoreCase);
        if (match.Success && decimal.TryParse(match.Groups[1].Value, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var result))
        {
            return result;
        }
        return 0;
    }
}
