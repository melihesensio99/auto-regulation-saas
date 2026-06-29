using System;

namespace SmartCoaching.Api.DTOs;

public class AgentRequest
{
    public string Message { get; set; } = string.Empty;
    public Guid? ContextAthleteId { get; set; }
    public string? ContextAthleteName { get; set; }
}
