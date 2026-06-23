using System;

namespace SmartCoaching.Application.Common.Events;

public record WeeklyCheckInSubmittedEvent(
    Guid WeeklyCheckInId,
    Guid AthleteId
);
