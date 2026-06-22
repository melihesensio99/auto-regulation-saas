using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartCoaching.Application.Features.Coaches.Commands.CreateCoach;
using SmartCoaching.Domain.Constants;
using System.Threading.Tasks;

namespace SmartCoaching.Api.Controllers;

public class CoachesController(ISender sender) : ApiControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateCoach([FromBody] CreateCoachCommand command)
    {
        return HandleResult(await sender.Send(command));
    }

    [HttpGet("dashboard")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> GetDashboard()
    {
        return HandleResult(await sender.Send(new GetCoachDashboardSummaryQuery()));
    }
}
