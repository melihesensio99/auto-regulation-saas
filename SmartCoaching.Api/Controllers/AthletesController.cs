using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SmartCoaching.Application.Features.Athletes.Commands.CreateAthlete;
using System.Threading.Tasks;

namespace SmartCoaching.Api.Controllers;

// C# 12 Primary Constructor (ISender sender) burada kullanılıyor!
[Authorize]
public class AthletesController(ISender sender) : ApiControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateAthlete([FromBody] CreateAthleteCommand command)
    {
        return HandleResult(await sender.Send(command));
    }

    [HttpGet]
    public async Task<IActionResult> GetAthletes()
    {
        return HandleResult(await sender.Send(new SmartCoaching.Application.Features.Athletes.Queries.GetAthletes.GetAthletesQuery()));
    }

    [HttpPut("{id}/targets")]
    public async Task<IActionResult> UpdateTargets(Guid id, [FromBody] SmartCoaching.Application.Features.Athletes.Commands.UpdateAthleteTargetsCommand.UpdateAthleteTargetsCommand command)
    {
        // URL'den gelen id değerini, command objesinin içine yerleştiriyoruz
        var commandWithId = command with { AthleteId = id };
        return HandleResult(await sender.Send(commandWithId));
    }

    [HttpGet("crash")]
    [Microsoft.AspNetCore.Authorization.AllowAnonymous]
    public IActionResult CrashSystem()
    {
        // Bu uç nokta KASITLI olarak sistemi çökertecektir (Kalkanı test etmek için)
        throw new System.Exception("BOMBA PATLADI! Sunucu veritabanına bağlanırken kritik bir çökme yaşadı.");
    }
}
