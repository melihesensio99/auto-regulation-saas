using Microsoft.Extensions.Configuration;
using SmartCoaching.Application.Common.Constants;
using SmartCoaching.Application.Common.Interfaces;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Infrastructure.Services;

public class MistralAiService : IAiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public MistralAiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GenerateInsightAsync(string teamDataJson, CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Mistral:ApiKey"];
        var model = _configuration["Mistral:Model"] ?? "mistral-small-latest";

        if (string.IsNullOrEmpty(apiKey))
            return "Sistem uyarısı: Yapay zeka API anahtarı yapılandırılmamış.";

        var requestBody = new
        {
            model = model,
            messages = new[]
            {
                new { role = "system", content = PromptTemplates.CoachDashboardAnalysisSystemPrompt },
                new { role = "user", content = teamDataJson }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.mistral.ai/v1/chat/completions");
        request.Headers.Add("Authorization", $"Bearer {apiKey}");
        request.Content = JsonContent.Create(requestBody);

        var response = await _httpClient.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            return $"AI Analiz Hatası: {response.StatusCode}";
        }

        using var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var jsonDoc = await JsonDocument.ParseAsync(responseStream, cancellationToken: cancellationToken);
        
        var insight = jsonDoc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return insight?.Trim() ?? "Yapay zeka geçerli bir yanıt üretemedi.";
    }

    public async Task<string> GenerateWeeklyAnalysisAsync(string prompt, CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Mistral:ApiKey"];
        var model = _configuration["Mistral:Model"] ?? "mistral-small-latest";

        if (string.IsNullOrEmpty(apiKey))
            return "Sistem uyarısı: Yapay zeka API anahtarı yapılandırılmamış.";

        var requestBody = new
        {
            model = model,
            messages = new[]
            {
                new { role = "system", content = "Sen profesyonel ve analitik düşünen bir sporcu koç asistanısın. Verilen verileri inceleyip, antrenöre tavsiyelerde bulunursun." },
                new { role = "user", content = prompt }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.mistral.ai/v1/chat/completions");
        request.Headers.Add("Authorization", $"Bearer {apiKey}");
        request.Content = JsonContent.Create(requestBody);

        var response = await _httpClient.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return $"AI Analiz Hatası: {response.StatusCode}";
        }

        using var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var jsonDoc = await JsonDocument.ParseAsync(responseStream, cancellationToken: cancellationToken);
        
        var messageContent = jsonDoc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return messageContent?.Trim() ?? "No analysis generated.";
    }
}
