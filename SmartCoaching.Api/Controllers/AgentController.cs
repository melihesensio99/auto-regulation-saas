using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartCoaching.Domain.Constants;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Features.Agent.Commands.SendAgentMessage;
using SmartCoaching.Api.DTOs;

using MediatR;

namespace SmartCoaching.Api.Controllers;

[Authorize(Roles = Roles.Coach)]
[Route("api/agent")]
public class AgentController : ApiControllerBase
{
    private readonly ISender _mediator;

    public AgentController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("chat")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AgentResponse))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Chat([FromBody] AgentRequest request, CancellationToken cancellationToken)
    {
        var coachIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(coachIdClaim, out var coachId))
        {
            return Unauthorized();
        }

        var command = new SendAgentMessageCommand(
            coachId,
            request.Message,
            request.ContextAthleteId,
            request.ContextAthleteName
        );

        var response = await _mediator.Send(command, cancellationToken);
            
        return Ok(response);
    }
}
