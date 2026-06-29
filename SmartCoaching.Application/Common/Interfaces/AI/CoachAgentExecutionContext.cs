using System;
using System.Threading;

namespace SmartCoaching.Application.Common.Interfaces.AI;

public record CoachAgentExecutionContext(
    string ApiKey,
    string ModelId,
    Guid CoachId,
    string Message,
    Guid? ContextAthleteId,
    string? ContextAthleteName,
    CancellationToken CancellationToken);
