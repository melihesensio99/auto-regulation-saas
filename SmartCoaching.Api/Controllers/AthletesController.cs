using Microsoft.AspNetCore.Mvc;
using SmartCoaching.Application.Features.Athletes.Commands.CreateAthleteCommand;
using System.Threading.Tasks;

namespace SmartCoaching.Api.Controllers;

// Artık "ApiControllerBase" miras alınıyor!
public class AthletesController : ApiControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateAthlete([FromBody] CreateAthleteCommand command)
    {
        // İşte her şey tek satıra indi!
        return HandleResult(await Sender.Send(command));
    }
}
