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
        return HandleResult(await sender.Send(new GetAthletesQuery()));
    }

    [HttpPut("{id}/targets")]
    public async Task<IActionResult> UpdateTargets(Guid id, [FromBody] UpdateAthleteTargetsRequestDto dto)
    {
        var command = new UpdateAthleteTargetsCommand(id, dto.TargetCalories, dto.TargetSteps);
        return HandleResult(await sender.Send(command));
    }

    [HttpPost("{id}/progress")]
    public async Task<IActionResult> LogProgress(Guid id, [FromBody] LogDailyProgressRequestDto dto)
    {
        var command = new LogDailyProgressCommand(id, dto.Date, dto.ConsumedCalories, dto.TakenSteps, dto.Notes);
        return HandleResult(await sender.Send(command));
    }

    [HttpPost("{id}/check-in")]
    public async Task<IActionResult> SubmitCheckIn(Guid id, [FromBody] SubmitWeeklyCheckInRequestDto dto)
    {
        var command = new SubmitWeeklyCheckInCommand(id, dto.Date, dto.WeightKg, dto.FrontPhotoUrl, dto.BackPhotoUrl, dto.SidePhotoUrl);
        return HandleResult(await sender.Send(command));
    }

    [HttpGet("{id}/progress")]
    public async Task<IActionResult> GetProgress(Guid id, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var query = new GetAthleteProgressQuery(id, startDate, endDate);
        return HandleResult(await sender.Send(query));
    }

    [HttpGet("crash")]
    [Microsoft.AspNetCore.Authorization.AllowAnonymous]
    public IActionResult CrashSystem()
    {
        // Bu uç nokta KASITLI olarak sistemi çökertecektir (Kalkanı test etmek için)
        throw new System.Exception("BOMBA PATLADI! Sunucu veritabanına bağlanırken kritik bir çökme yaşadı.");
    }
}
