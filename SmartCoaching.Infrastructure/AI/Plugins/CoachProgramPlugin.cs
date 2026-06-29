using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.SemanticKernel;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Features.Athletes.Commands.AssignDietProgram;
using SmartCoaching.Application.Features.Athletes.Commands.AssignWorkoutProgram;
using SmartCoaching.Application.Features.Athletes.Queries.GetDietProgram;
using SmartCoaching.Application.Features.Athletes.Queries.GetWorkoutProgram;

namespace SmartCoaching.Infrastructure.AI.Plugins;

/// <summary>
/// Koçun beslenme ve antrenman programlarını okuması ve güncellemesi için kullanılan plugin.
/// Tüm işlemler MediatR üzerinden ilerler, böylece validation ve domain kuralları korunur.
/// </summary>
public class CoachProgramPlugin
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    private readonly ISender _sender;
    private readonly IAgentToolResultTracker _toolResultTracker;

    public CoachProgramPlugin(ISender sender, IAgentToolResultTracker toolResultTracker)
    {
        _sender = sender;
        _toolResultTracker = toolResultTracker;
    }

    [KernelFunction("GetDietProgram")]
    [Description("Sporcunun mevcut beslenme programını, öğün listesini ve toplam kalori/makro özetini getirir.")]
    public async Task<string> GetDietProgramAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAthleteDietProgramQuery(athleteId), cancellationToken);

        return result.IsSuccess
            ? JsonSerializer.Serialize(result.Value, JsonOptions)
            : JsonSerializer.Serialize(new
            {
                error = result.Error.Message,
                code = result.Error.Code
            }, JsonOptions);
    }

    [KernelFunction("UpdateDietProgram")]
    [Description("Sporcunun beslenme programını tamamen yeniler. Genel notlar ile öğün listesini birlikte gönder.")]
    public async Task<string> UpdateDietProgramAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        [Description("Genel diyet notları")] string generalDietNotes,
        [Description("Öğünlerin listesi. Her öğün order, mealName, foods ve notes alanlarını içermelidir.")] List<DietMealDto> meals,
        CancellationToken cancellationToken)
    {
        var command = new AssignDietProgramCommand
        {
            AthleteId = athleteId,
            GeneralDietNotes = generalDietNotes ?? string.Empty,
            Meals = meals ?? new List<DietMealDto>()
        };

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsSuccess)
        {
            _toolResultTracker.RecordUiAction("REFRESH_DASHBOARD", new
            {
                athleteId,
                scope = "diet"
            });

            return JsonSerializer.Serialize(new
            {
                result = "success",
                message = "Diet program updated successfully.",
                athleteId
            }, JsonOptions);
        }

        return JsonSerializer.Serialize(new
        {
            result = "failure",
            error = result.Error.Message,
            code = result.Error.Code
        }, JsonOptions);
    }

    [KernelFunction("GetWorkoutProgram")]
    [Description("Sporcunun mevcut antrenman programını getirir.")]
    public async Task<string> GetWorkoutProgramAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAthleteWorkoutProgramQuery(athleteId), cancellationToken);

        return result.IsSuccess
            ? JsonSerializer.Serialize(result.Value, JsonOptions)
            : JsonSerializer.Serialize(new
            {
                error = result.Error.Message,
                code = result.Error.Code
            }, JsonOptions);
    }

    [KernelFunction("UpdateWorkoutProgram")]
    [Description("Sporcunun antrenman programını tamamen yeniler. Egzersiz listesini dayName, exerciseName, sets, reps, restTimeInSeconds ve notes alanlarıyla gönder.")]
    public async Task<string> UpdateWorkoutProgramAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        [Description("Egzersizlerin listesi. Her egzersiz dayName, exerciseName, sets, reps, restTimeInSeconds ve notes alanlarını içermelidir.")] List<WorkoutExerciseDto> exercises,
        CancellationToken cancellationToken)
    {
        var command = new AssignWorkoutProgramCommand(
            athleteId,
            exercises ?? new List<WorkoutExerciseDto>());

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsSuccess)
        {
            _toolResultTracker.RecordUiAction("REFRESH_DASHBOARD", new
            {
                athleteId,
                scope = "workout"
            });

            return JsonSerializer.Serialize(new
            {
                result = "success",
                message = "Workout program updated successfully.",
                athleteId
            }, JsonOptions);
        }

        return JsonSerializer.Serialize(new
        {
            result = "failure",
            error = result.Error.Message,
            code = result.Error.Code
        }, JsonOptions);
    }
}
