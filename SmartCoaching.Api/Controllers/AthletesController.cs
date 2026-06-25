using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SmartCoaching.Application.Features.Athletes.Commands.CreateAthlete;
using SmartCoaching.Application.Features.Athletes.Commands.AssignWorkoutProgram;
using SmartCoaching.Application.Features.Athletes.Commands.SubmitOnboardingForm;
using SmartCoaching.Application.Features.Athletes.Queries.GetWorkoutProgram;
using SmartCoaching.Application.Features.Athletes.Commands.AssignDietProgram;
using SmartCoaching.Application.Features.Athletes.Queries.GetDietProgram;
using SmartCoaching.Application.Features.Athletes.Commands.LogProgressCommand;
using SmartCoaching.Application.Features.Athletes.Queries.GetAthleteProgressLogs;
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
    public async Task<IActionResult> LogProgress(Guid id, [FromBody] LogProgressRequestDto dto)
    {
        var command = new LogProgressCommand(
            id, 
            dto.Date, 
            dto.ConsumedCalories, 
            dto.TakenSteps, 
            dto.IsWorkoutCompleted, 
            dto.WeightKg, 
            dto.Notes, 
            dto.FrontPhotoUrl, 
            dto.BackPhotoUrl, 
            dto.SidePhotoUrl);
        return HandleResult(await sender.Send(command));
    }

    [HttpPost("{id}/onboarding")]
    [Authorize(Roles = Roles.Athlete)]
    public async Task<IActionResult> SubmitOnboardingForm(Guid id, [FromBody] SubmitOnboardingFormRequestDto dto)
    {
        var command = new SubmitOnboardingFormCommand(
            id, 
            dto.DateOfBirth, 
            dto.PhoneNumber,
            dto.Occupation,
            dto.MainReason,
            dto.ShortTermGoal,
            dto.LongTermGoal,
            dto.Expectations,
            dto.HeightCm, 
            dto.StartingWeightKg, 
            dto.TrainingHistory,
            dto.CurrentTrainingRoutine,
            dto.OutsidePhysicalActivity,
            dto.HasTrackedMacros,
            dto.HasWorkedWithCoach,
            dto.HearAboutUs,
            dto.AdditionalNotes
        );
        return HandleResult(await sender.Send(command));
    }



    [HttpPut("{id}/progress/{progressLogId}/feedback")]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> AddCoachFeedback(Guid id, Guid progressLogId, [FromBody] AddCoachFeedbackRequestDto dto)
    {
        var command = new AddCoachFeedbackCommand(id, progressLogId, dto.Feedback);
        return HandleResult(await sender.Send(command));
    }

    [HttpGet("{id}/progress")]
    [Authorize(Roles = Roles.Coach + "," + Roles.Athlete)]
    public async Task<IActionResult> GetProgressLogs(Guid id, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var query = new GetAthleteProgressLogsQuery(id, startDate, endDate);
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
        var command = new AssignDietProgramCommand { AthleteId = id, GeneralDietNotes = dto.GeneralDietNotes, Meals = dto.Meals };
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
