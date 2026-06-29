using System;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Features.Athletes.Commands.UpdateAthleteTargetsCommand;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Infrastructure.AI.Plugins;

/// <summary>
/// Beslenme ve hedef yönetimiyle ilgili mutasyonları içerir.
/// Tüm değişiklikler MediatR command hattı üzerinden gider; validation ve domain kuralları korunur.
/// </summary>
public class NutritionPlugin
{
    private readonly IApplicationDbContext _context;
    private readonly ISender _sender;
    private readonly IAgentCoachContext _coachContext;
    private readonly IAgentToolResultTracker _toolResultTracker;

    public NutritionPlugin(
        IApplicationDbContext context,
        ISender sender,
        IAgentCoachContext coachContext,
        IAgentToolResultTracker toolResultTracker)
    {
        _context = context;
        _sender = sender;
        _coachContext = coachContext;
        _toolResultTracker = toolResultTracker;
    }

    [KernelFunction("UpdateTargetCalories")]
    [Description("Sporcunun günlük hedef kalorisini günceller.")]
    public async Task<string> UpdateTargetCaloriesAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        [Description("Yeni hedef kalori miktarı")] int calories,
        CancellationToken cancellationToken)
    {
        var command = new UpdateAthleteTargetsCommand(
            AthleteId: athleteId,
            TargetCalories: calories,
            TargetSteps: null);

        var result = await _sender.Send(command, cancellationToken);
        return BuildTargetUpdateResponse(result, athleteId, "calories");
    }

    [KernelFunction("UpdateTargetSteps")]
    [Description("Sporcunun günlük hedef adım sayısını günceller.")]
    public async Task<string> UpdateTargetStepsAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        [Description("Yeni hedef adım sayısı")] int steps,
        CancellationToken cancellationToken)
    {
        var currentCalories = await GetCurrentCaloriesAsync(athleteId, cancellationToken);
        if (currentCalories is null)
        {
            return "{\"result\":\"failure\",\"error\":\"Athlete not found or not assigned to you.\",\"code\":\"Athlete.NotFound\"}";
        }

        var command = new UpdateAthleteTargetsCommand(
            AthleteId: athleteId,
            TargetCalories: currentCalories.Value,
            TargetSteps: steps);

        var result = await _sender.Send(command, cancellationToken);
        return BuildTargetUpdateResponse(result, athleteId, "steps");
    }

    [KernelFunction("UpdateTargets")]
    [Description("Sporcunun hedef kalorisini ve hedef adım sayısını birlikte günceller.")]
    public async Task<string> UpdateTargetsAsync(
        [Description("Sporcunun benzersiz kimliği (Guid)")] Guid athleteId,
        [Description("Yeni hedef kalori miktarı")] int calories,
        [Description("Yeni hedef adım sayısı")] int steps,
        CancellationToken cancellationToken)
    {
        var command = new UpdateAthleteTargetsCommand(
            AthleteId: athleteId,
            TargetCalories: calories,
            TargetSteps: steps);

        var result = await _sender.Send(command, cancellationToken);
        return BuildTargetUpdateResponse(result, athleteId, "targets");
    }

    private string BuildTargetUpdateResponse(
        Result result,
        Guid athleteId,
        string targetType)
    {
        _ = _coachContext.CoachId;

        if (result.IsSuccess)
        {
            _toolResultTracker.RecordUiAction("REFRESH_DASHBOARD", new
            {
                athleteId,
                scope = targetType
            });

            return $"{{\"result\":\"success\",\"message\":\"Athlete target {targetType} updated successfully. UI has been instructed to refresh.\"}}";
        }

        return $"{{\"result\":\"failure\",\"error\":\"{result.Error.Message}\",\"code\":\"{result.Error.Code}\"}}";
    }

    private async Task<decimal?> GetCurrentCaloriesAsync(Guid athleteId, CancellationToken cancellationToken)
    {
        var coachId = _coachContext.CoachId;

        return await _context.Athletes
            .Where(a => a.Id == athleteId && a.CoachId == coachId)
            .Select(a => (decimal?)a.TargetCalories)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
