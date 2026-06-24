using System;

namespace SmartCoaching.Application.Common.Events;

public class OnboardingCompletedEvent
{
    public Guid AthleteId { get; set; }
    public Guid CoachId { get; set; }
    public string AthleteFullName { get; set; } = string.Empty;
}
