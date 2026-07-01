using MediatR;
using Microsoft.SemanticKernel;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Common.Interfaces.AI;

namespace SmartCoaching.Infrastructure.AI.Agents;

public class NutritionCoachAgentExecutor : BaseCoachAgentExecutor
{
    public NutritionCoachAgentExecutor(
        IApplicationDbContext context,
        IAgentCoachContext coachContext,
        IAgentToolResultTracker toolResultTracker,
        ISender sender)
        : base(context, coachContext, toolResultTracker, sender)
    {
    }

    public override CoachAgentRoute Route => CoachAgentRoute.Nutrition;

    protected override void RegisterPlugins(IKernelBuilder builder)
    {
        AddAthletePlugin(builder);
        AddNutritionPlugin(builder);
        AddCoachProgramPlugin(builder);
    }

    protected override string BuildSystemPrompt(System.Guid? contextAthleteId, string? contextAthleteName)
    {
        var baseContext = BuildContextPrompt(contextAthleteId, contextAthleteName);

        return $$"""
Sen bir nutrition coach agent'sin.
Odak alanın:
- sporcunun kalori hedefi
- günlük adım hedefi
- beslenme planı
- kilo değişimine göre beslenme ve hedef ayarlaması

Kullanacağın araçlar:
- GetAthletes
- GetAthleteProfile
- GetAthleteProgress
- GetAthleteConsumedFoods
- GetDietProgram
- UpdateDietProgram
- UpdateTargetCalories
- UpdateTargetSteps
- UpdateTargets

Kurallar:
- Bir hedef değişikliği yapmadan önce mümkünse sporcunun profilini ve son gelişim loglarını oku.
- Kilo alma/kilo verme amacıyla gelen isteklerde profile bak, sonra son loglara bak, sonra hedef ve/veya beslenme planını güncelle.
- Toplam kalori veya makro sorulursa önce mevcut beslenme planını oku, sonra koça kısa ve net cevap ver.
- Gereksiz uzun açıklama yapma; uygulanabilir öneriler ver.
- Cevapların Türkçe, profesyonel ve doğal olsun.
{{baseContext}}
""";
    }
}
