using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartCoaching.Application.Features.Athletes.Commands.CreateAthlete;
using System.Threading.Tasks;

namespace SmartCoaching.Api.Controllers;

// C# 12 Primary Constructor (ISender sender) burada kullanılıyor!
public class AthletesController(ISender sender) : ApiControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateAthlete([FromBody] CreateAthleteCommand command)
    {
        return HandleResult(await sender.Send(command));
    }
}
