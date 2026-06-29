using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Common.Interfaces.AI;

namespace SmartCoaching.Infrastructure.AI;

public class GeminiAgentService : IAiAgentService
{
    private readonly IConfiguration _configuration;
    private readonly IAgentCoachContext _coachContext;
    private readonly IAgentToolResultTracker _toolResultTracker;
    private readonly IReadOnlyDictionary<CoachAgentRoute, ICoachAgentExecutor> _executors;
    private readonly string _modelId;

    public GeminiAgentService(
        IConfiguration configuration,
        IAgentCoachContext coachContext,
        IAgentToolResultTracker toolResultTracker,
        IEnumerable<ICoachAgentExecutor> executors)
    {
        _configuration = configuration;
        _coachContext = coachContext;
        _toolResultTracker = toolResultTracker;
        _executors = executors.ToDictionary(x => x.Route, x => x);
        _modelId = _configuration["Gemini:Model"] ?? "gemini-2.5-flash-lite";
    }

    public async Task<AgentResponse> ProcessCoachMessageAsync(
        Guid coachId,
        string message,
        Guid? contextAthleteId = null,
        string? contextAthleteName = null,
        CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Gemini:ApiKey"] ?? string.Empty;
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return new AgentResponse
            {
                TextReply = "Gemini API key bulunamadı. Önce yapılandırmayı tamamlayalım."
            };
        }

        _coachContext.SetCoachId(coachId);
        _toolResultTracker.Clear();

        var route = ResolveRoute(message);
        var executor = _executors[route];

        var context = new CoachAgentExecutionContext(
            ApiKey: apiKey,
            ModelId: _modelId,
            CoachId: coachId,
            Message: message,
            ContextAthleteId: contextAthleteId,
            ContextAthleteName: contextAthleteName,
            CancellationToken: cancellationToken);

        return await executor.ExecuteAsync(context);
    }

    private static CoachAgentRoute ResolveRoute(string message)
    {
        var text = message.ToLowerInvariant();

        if (ContainsAny(text,
                "kalori", "beslen", "öğün", "ogun", "makro", "protein", "karb", "karbonhidrat",
                "yağ", "yag", "diyet", "kilo ver", "kilo al", "adım", "adim", "step"))
        {
            return CoachAgentRoute.Nutrition;
        }

        if (ContainsAny(text,
                "antrenman", "idman", "workout", "egzersiz", "exercise", "set", "tekrar",
                "dinlenme", "programı değiştir", "programi degistir", "hareket"))
        {
            return CoachAgentRoute.Workout;
        }

        return CoachAgentRoute.GeneralInsight;
    }

    private static bool ContainsAny(string text, params string[] keywords)
        => keywords.Any(text.Contains);
}
