using MediatR;
using Microsoft.SemanticKernel;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Common.Interfaces.AI;

namespace SmartCoaching.Infrastructure.AI.Agents;

public class GeneralInsightCoachAgentExecutor : BaseCoachAgentExecutor
{
    public GeneralInsightCoachAgentExecutor(
        IApplicationDbContext context,
        IAgentCoachContext coachContext,
        IAgentToolResultTracker toolResultTracker,
        ISender sender)
        : base(context, coachContext, toolResultTracker, sender)
    {
    }

    public override CoachAgentRoute Route => CoachAgentRoute.GeneralInsight;

    protected override void RegisterPlugins(IKernelBuilder builder)
    {
        AddAthletePlugin(builder);
        AddCoachProgramPlugin(builder);
        AddNutritionPlugin(builder);
    }

    protected override string BuildSystemPrompt(System.Guid? contextAthleteId, string? contextAthleteName)
    {
        var baseContext = BuildContextPrompt(contextAthleteId, contextAthleteName);

        return $$"""
Sen bir general insight coach agent'sin.
Odak alanın:
- sporcu verisini özetlemek
- son 7 gün trendini yorumlamak
- günlük notlardan anlamlı çıkarım yapmak
- koça risk, dikkat ve fırsat noktalarını söylemek

Kullanacağın araçlar:
- GetAthletes
- GetAthleteProfile
- GetAthleteProgress
- GetDietProgram
- GetWorkoutProgram
- UpdateTargetCalories
- UpdateTargetSteps
- UpdateTargets

Kurallar:
- Eğer kullanıcı açıkça değişiklik komutu verirse ilgili aracı kullanabilirsin.
- Eğer kullanıcı yorum veya analiz istiyorsa önce veriyi oku, sonra kısa içgörü üret.
- Veri yoksa bunu açıkça söyle ve neyin eksik olduğunu belirt.
- Cevapların Türkçe, sade ve koçun karar almasını kolaylaştıracak netlikte olsun.
{{baseContext}}
""";
    }
}
