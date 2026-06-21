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
}
