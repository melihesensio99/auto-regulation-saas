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
using SmartCoaching.Application.Features.Exercises.Queries;

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
        [Description("Öğünlerin listesini JSON formatında string olarak gönder. Örnek: [{\"order\": 1, \"mealName\": \"Sabah\", \"foods\": \"2 yumurta\", \"notes\": \"\"}]")] string mealsJson,
        CancellationToken cancellationToken)
    {
        var meals = new List<DietMealDto>();
        try
        {
            if (!string.IsNullOrWhiteSpace(mealsJson))
            {
                meals = JsonSerializer.Deserialize<List<DietMealDto>>(mealsJson, JsonOptions) ?? new List<DietMealDto>();
            }
        }
        catch (Exception ex)
        {
            return JsonSerializer.Serialize(new { error = "Invalid meals format. Must be a JSON array.", details = ex.Message });
        }

        var command = new AssignDietProgramCommand
        {
            AthleteId = athleteId,
            GeneralDietNotes = generalDietNotes ?? string.Empty,
            Meals = meals
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
    [Description("Sporcunun antrenman programını tamamen yeniler. Egzersiz listesini JSON formatında string olarak gönder.")]
    public async Task<string> UpdateWorkoutProgramAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        [Description("Egzersizlerin listesini JSON formatında string olarak gönder. Örnek: [{\"dayName\": \"Monday\", \"exerciseName\": \"Squat\", \"sets\": 3, \"reps\": \"10\", \"restTimeInSeconds\": 60, \"notes\": \"\", \"exerciseLibraryId\": \"uuid-here\"}]")] string exercisesJson,
        CancellationToken cancellationToken)
    {
        var exercises = new List<WorkoutExerciseDto>();
        try
        {
            if (!string.IsNullOrWhiteSpace(exercisesJson))
            {
                exercises = JsonSerializer.Deserialize<List<WorkoutExerciseDto>>(exercisesJson, JsonOptions) ?? new List<WorkoutExerciseDto>();
            }
        }
        catch (Exception ex)
        {
            return JsonSerializer.Serialize(new { error = "Invalid exercises format. Must be a JSON array.", details = ex.Message });
        }

        var command = new AssignWorkoutProgramCommand(
            athleteId,
            exercises);

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

    [KernelFunction("SearchExercises")]
    [Description("Antrenman programına egzersiz eklemeden önce, egzersizin veritabanındaki ID'sini (ExerciseLibraryId) bulmak için kullanılır. Arama kelimesi (örneğin 'Squat') alır ve eşleşen egzersizleri döndürür.")]
    public async Task<string> SearchExercisesAsync(
        [Description("Aranacak egzersiz adı veya kas grubu (örn. 'bench', 'curl', 'chest')")] string query,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new SearchExercisesQuery(query), cancellationToken);
        return JsonSerializer.Serialize(result, JsonOptions);
    }
}
