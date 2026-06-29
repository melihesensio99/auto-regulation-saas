using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SmartCoaching.Application.Common.Interfaces;

namespace SmartCoaching.Application.Features.Agent.Commands.SendAgentMessage;

public class SendAgentMessageCommandHandler : IRequestHandler<SendAgentMessageCommand, AgentResponse>
{
    private readonly IAiAgentService _aiAgentService;

    public SendAgentMessageCommandHandler(IAiAgentService aiAgentService)
    {
        _aiAgentService = aiAgentService;
    }

    public async Task<AgentResponse> Handle(SendAgentMessageCommand request, CancellationToken cancellationToken)
    {
        return await _aiAgentService.ProcessCoachMessageAsync(
            request.CoachId,
            request.Message,
            request.ContextAthleteId,
            request.ContextAthleteName,
            cancellationToken);
    }
}
