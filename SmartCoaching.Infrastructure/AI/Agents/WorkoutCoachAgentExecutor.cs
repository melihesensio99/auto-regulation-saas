using MediatR;
using Microsoft.SemanticKernel;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Common.Interfaces.AI;

namespace SmartCoaching.Infrastructure.AI.Agents;

public class WorkoutCoachAgentExecutor : BaseCoachAgentExecutor
{
    public WorkoutCoachAgentExecutor(
        IApplicationDbContext context,
        IAgentCoachContext coachContext,
        IAgentToolResultTracker toolResultTracker,
        ISender sender)
        : base(context, coachContext, toolResultTracker, sender)
    {
    }

    public override CoachAgentRoute Route => CoachAgentRoute.Workout;

    protected override void RegisterPlugins(IKernelBuilder builder)
    {
        AddAthletePlugin(builder);
        AddCoachProgramPlugin(builder);
    }

    protected override string BuildSystemPrompt(System.Guid? contextAthleteId, string? contextAthleteName)
    {
        var baseContext = BuildContextPrompt(contextAthleteId, contextAthleteName);

        return $$"""
Sen bir workout coach agent'sin.
Odak alanın:
- antrenman programı
- egzersiz seçimi
- set / tekrar / dinlenme düzeni
- günlük notlar ve gelişim durumuna göre antrenman önerisi

Kullanacağın araçlar:
- GetAthletes
- GetAthleteProfile
- GetAthleteProgress
- GetWorkoutProgram
- UpdateWorkoutProgram

Kurallar:
- Program değişikliği istenirse önce mevcut antrenman programını oku, sonra gerekli değişikliği yap.
- Notlara ve son loglara göre toparlanma, yüklenme ve düzen önerisi sun.
- Beslenme tarafına girme; sadece antrenman ve yük yönetimine odaklan.
- Cevapların Türkçe, kısa ve koçun direkt uygulayabileceği netlikte olsun.
{{baseContext}}
""";
    }
}
