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

    public async Task<string> CalculateMacrosAsync(string jsonPayload, CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Mistral:ApiKey"];
        var model = _configuration["Mistral:Model"] ?? "mistral-small-latest";

        if (string.IsNullOrEmpty(apiKey))
            return "{}";

        var requestBody = new
        {
            model = model,
            response_format = new { type = "json_object" },
            messages = new[]
            {
                new { role = "system", content = "Sen profesyonel bir diyetisyen yapay zekasÄ±n. Sana verilen tÃ¼m Ã¶ÄŸÃ¼nlerdeki yiyecek metinlerini analiz et ve sadece programin toplamini dÃ¶n. Protein, Karbonhidrat (Carbs), YaÄŸ (Fats) ve Kalori (Calories) deÄŸerlerini tahmin et. DÃ¶nÃ¼ÅŸÃ¼n SADECE aÅŸaÄŸÄ±daki gibi JSON formatÄ±nda olmalÄ±dÄ±r: {\"Protein\": 140, \"Carbs\": 220, \"Fats\": 55, \"Calories\": 1850}" },
                new { role = "user", content = jsonPayload }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.mistral.ai/v1/chat/completions");
        request.Headers.Add("Authorization", $"Bearer {apiKey}");
        request.Content = JsonContent.Create(requestBody);

        var response = await _httpClient.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
            return "{}";

        using var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var jsonDoc = await JsonDocument.ParseAsync(responseStream, cancellationToken: cancellationToken);

        var messageContent = jsonDoc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return messageContent?.Trim() ?? "{}";
    }
}
