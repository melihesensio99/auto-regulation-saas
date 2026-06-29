using System.Threading.Tasks;
using SmartCoaching.Application.Common.Interfaces;

namespace SmartCoaching.Application.Common.Interfaces.AI;

public interface ICoachAgentExecutor
{
    CoachAgentRoute Route { get; }
    Task<AgentResponse> ExecuteAsync(CoachAgentExecutionContext context);
}
