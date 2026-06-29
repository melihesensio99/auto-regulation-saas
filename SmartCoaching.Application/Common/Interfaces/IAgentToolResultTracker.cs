using System;
using System.Collections.Generic;
using System.Threading;

namespace SmartCoaching.Application.Common.Interfaces;

/// <summary>
/// Plugin'lerin çalıştırılması sırasında üretilen structured UI action'ları toplar.
/// Bu sayede uiAction, modelin serbest metninden parse edilmek zorunda kalmaz.
/// Scoped olarak register edilir ve her request'te sıfırlanır.
/// </summary>
public interface IAgentToolResultTracker
{
    void RecordUiAction(string uiAction, object? data = null);
    IReadOnlyList<AgentUiAction> GetRecordedActions();
    void Clear();
}

public record AgentUiAction(string Action, object? Data);

public class AgentToolResultTracker : IAgentToolResultTracker
{
    private readonly List<AgentUiAction> _actions = new();

    public void RecordUiAction(string uiAction, object? data = null)
    {
        _actions.Add(new AgentUiAction(uiAction, data));
    }

    public IReadOnlyList<AgentUiAction> GetRecordedActions() => _actions.AsReadOnly();

    public void Clear() => _actions.Clear();
}
