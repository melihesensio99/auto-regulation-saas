using System;

namespace SmartCoaching.Application.Common.Interfaces;

/// <summary>
/// Plugin'lerin auth context'e güvenli erişimi için scoped servis.
/// coachId hiçbir zaman LLM'den gelmez; JWT claim'den enjekte edilir.
/// </summary>
public interface IAgentCoachContext
{
    Guid CoachId { get; }
    void SetCoachId(Guid coachId);
}

public class AgentCoachContext : IAgentCoachContext
{
    private Guid _coachId;
    private bool _isSet;

    public Guid CoachId => _isSet
        ? _coachId
        : throw new InvalidOperationException("CoachId has not been set. Ensure SetCoachId is called before accessing.");

    public void SetCoachId(Guid coachId)
    {
        _coachId = coachId;
        _isSet = true;
    }
}
