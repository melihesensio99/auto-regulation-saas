using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SmartCoaching.Application.Features.Athletes.Commands.CreateAthlete;
using SmartCoaching.Application.Features.Athletes.Commands.AssignWorkoutProgram;
using SmartCoaching.Application.Features.Athletes.Queries.GetWorkoutProgram;
using SmartCoaching.Application.Features.Athletes.Commands.AssignDietProgram;
using SmartCoaching.Application.Features.Athletes.Queries.GetDietProgram;
using SmartCoaching.Application.Features.Athletes.Queries.GetAthleteCheckIns;
using SmartCoaching.Application.Features.Athletes.Commands.AddCoachFeedback;
using SmartCoaching.Domain.Constants;
using System;
using System.Threading.Tasks;

namespace SmartCoaching.Api.Controllers;

// C# 12 Primary Constructor (ISender sender) burada kullanılıyor!
[Authorize]
public class AthletesController(ISender sender) : ApiControllerBase
{
    [HttpPost]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> CreateAthlete([FromBody] CreateAthleteCommand command)
    {
        return HandleResult(await sender.Send(command));
    }

    [HttpGet]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> GetAthletes()
    {
        return HandleResult(await sender.Send(new GetAthletesQuery()));
    }

    [HttpPut("{id}/targets")]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> UpdateTargets(Guid id, [FromBody] UpdateAthleteTargetsRequestDto dto)
    {
        var command = new UpdateAthleteTargetsCommand(id, dto.TargetCalories, dto.TargetSteps);
        return HandleResult(await sender.Send(command));
    }

    [HttpPost("{id}/progress")]
    [Authorize(Roles = Roles.Athlete)]
    public async Task<IActionResult> LogProgress(Guid id, [FromBody] LogDailyProgressRequestDto dto)
    {
        var command = new LogDailyProgressCommand(id, dto.Date, dto.ConsumedCalories, dto.TakenSteps, dto.WeightKg, dto.IsWorkoutCompleted, dto.Notes);
        return HandleResult(await sender.Send(command));
    }

    [HttpPost("{id}/check-in")]
    [Authorize(Roles = Roles.Athlete)]
    public async Task<IActionResult> SubmitCheckIn(Guid id, [FromBody] SubmitWeeklyCheckInRequestDto dto)
    {
        var command = new SubmitWeeklyCheckInCommand(id, dto.Date, dto.WeightKg, dto.FrontPhotoUrl, dto.BackPhotoUrl, dto.SidePhotoUrl);
        return HandleResult(await sender.Send(command));
    }

    [HttpGet("{id}/check-ins")]
    [Authorize(Roles = Roles.Coach + "," + Roles.Athlete)]
    public async Task<IActionResult> GetCheckIns(Guid id)
    {
        var query = new GetAthleteCheckInsQuery(id);
        return HandleResult(await sender.Send(query));
    }

    [HttpPut("{id}/check-ins/{checkInId}/feedback")]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> AddCoachFeedback(Guid id, Guid checkInId, [FromBody] AddCoachFeedbackRequestDto dto)
    {
        var command = new AddCoachFeedbackCommand(id, checkInId, dto.Feedback);
        return HandleResult(await sender.Send(command));
    }

    [HttpGet("{id}/progress")]
    [Authorize(Roles = Roles.Coach + "," + Roles.Athlete)]
    public async Task<IActionResult> GetProgress(Guid id, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var query = new GetAthleteProgressQuery(id, startDate, endDate);
        return HandleResult(await sender.Send(query));
    }

    [HttpPost("{id}/workout-programs")]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> AssignWorkoutProgram(Guid id, [FromBody] AssignWorkoutProgramRequestDto dto)
    {
        var command = new AssignWorkoutProgramCommand(id, dto.Exercises);
        return HandleResult(await sender.Send(command));
    }

    [HttpGet("{id}/workout-programs")]
    [Authorize(Roles = Roles.Coach + "," + Roles.Athlete)]
    public async Task<IActionResult> GetWorkoutProgram(Guid id)
    {
        var query = new GetAthleteWorkoutProgramQuery(id);
        return HandleResult(await sender.Send(query));
    }

    [HttpPost("{id}/diet-programs")]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> AssignDietProgram(Guid id, [FromBody] AssignDietProgramRequestDto dto)
    {
        var command = new AssignDietProgramCommand { AthleteId = id, Meals = dto.Meals };
        return HandleResult(await sender.Send(command));
    }

    [HttpGet("{id}/diet-programs")]
    [Authorize(Roles = Roles.Coach + "," + Roles.Athlete)]
    public async Task<IActionResult> GetDietProgram(Guid id)
    {
        var query = new GetAthleteDietProgramQuery(id);
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
