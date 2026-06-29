using System;
using MediatR;
using SmartCoaching.Application.Common.Interfaces;

namespace SmartCoaching.Application.Features.Agent.Commands.SendAgentMessage;

public record SendAgentMessageCommand(
    Guid CoachId,
    string Message,
    Guid? ContextAthleteId,
    string? ContextAthleteName
) : IRequest<AgentResponse>;
