using System;

namespace SmartCoaching.Application.Common.Events;

public record AthleteCreatedEvent
{
    public Guid AthleteId { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string TemporaryPassword { get; init; } = string.Empty;
}
