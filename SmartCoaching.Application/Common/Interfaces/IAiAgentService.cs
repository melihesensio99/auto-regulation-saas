using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Common.Interfaces;

public class AgentResponse
{
    public string TextReply { get; set; } = string.Empty;
    public string? UiAction { get; set; }
    public object? ActionData { get; set; }
}

public interface IAiAgentService
{
    /// <summary>
    /// Koçun asistanla olan metin tabanlı etkileşimini işler ve gerekiyorsa arka plan araçlarını (Function Calling) tetikler.
    /// </summary>
    Task<AgentResponse> ProcessCoachMessageAsync(Guid coachId, string message, Guid? contextAthleteId = null, string? contextAthleteName = null, CancellationToken cancellationToken = default);
}
