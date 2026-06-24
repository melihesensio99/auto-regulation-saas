using System;

namespace SmartCoaching.Application.Common.Events;

public record DietPlanAssignedEvent(Guid AthleteId);
