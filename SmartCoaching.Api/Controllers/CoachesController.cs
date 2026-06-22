using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartCoaching.Application.Features.Coaches.Commands.CreateCoach;
using System.Threading.Tasks;

namespace SmartCoaching.Api.Controllers;

public class CoachesController(ISender sender) : ApiControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateCoach([FromBody] CreateCoachCommand command)
    {
        return HandleResult(await sender.Send(command));
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetCoaches([FromServices] SmartCoaching.Application.Common.Interfaces.IApplicationDbContext context)
    {
        var coaches = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(context.Coaches);
        return Ok(coaches);
    }

    [HttpGet("dashboard")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Coach")]
    public async Task<IActionResult> GetDashboard()
    {
        return HandleResult(await sender.Send(new GetCoachDashboardSummaryQuery()));
    }
}
