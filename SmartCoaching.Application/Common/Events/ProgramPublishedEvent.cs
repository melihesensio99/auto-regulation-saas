using System;

namespace SmartCoaching.Application.Common.Events;

public class ProgramPublishedEvent
{
    public Guid AthleteId { get; set; }
    public string AthleteEmail { get; set; } = string.Empty;
    public string AthleteFullName { get; set; } = string.Empty;
}
