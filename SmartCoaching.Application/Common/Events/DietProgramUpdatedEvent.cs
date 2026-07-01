using System;

namespace SmartCoaching.Application.Common.Events;

public record DietProgramUpdatedEvent(Guid AthleteId);
