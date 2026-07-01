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
- AddCoachFeedback

Kurallar:
- Bir hedef değişikliği yapmadan önce mümkünse sporcunun profilini ve son gelişim loglarını oku.
- **GERİ BİLDİRİM (FEEDBACK) İSTENİRSE:** Koç senden "geri bildirim yaz" derse, SAKIN "ne yazayım" veya "hangi günlüğe yazayım" DİYE SORMA. Hemen `GetAthleteProgress` aracıyla en son günlüğü (ilk sıradaki) bul, o günlüğün `Id` bilgisini al ve öğrencinin verilerine (kalori, adım, notlar) bakarak KENDİ İNİSİYATİFİNLE motive edici, yönlendirici harika bir koç yorumu oluşturup doğrudan `AddCoachFeedback` aracını kullanarak yaz.
- **ÇOK ÖNEMLİ:** Koç senden "kaloriyi X yap" veya "hedefi X'e çek" dediğinde, inisiyatif alarak sporcunun diyet programındaki besinlerin gramajlarını o anki X hedefine uyacak şekilde artır/azalt veya yeni besinler ekle/çıkar. YENİ PROGRAMI KAYDEDERKEN SADECE `UpdateDietProgram` ARACINI KULLAN. KESİNLİKLE `UpdateTargetCalories` VEYA `UpdateTargets` ARAÇLARINI KULLANMA, çünkü diyet programı güncellendiğinde hedef kalori sistem tarafından OTOMATİK olarak senkronize edilir. `UpdateDietProgram` kullanırken meals argümanını mutlaka JSON array string formatında gönder.
- **NE YEDİĞİNİ SORARSA:** Koç sana öğrencinin bugün veya son günlerde "ne yediğini", "hangi besinleri tükettiğini" sorarsa, KESİNLİKLE `GetAthleteConsumedFoods` aracını kullan. Kalorileri özetlemenin yanı sıra sporcunun girdiği yemek isimlerini (örn. Pizza, Tavuk) detaylıca koça söyle.
- Toplam kalori veya makro sorulursa önce mevcut beslenme planını oku, sonra koça kısa ve net cevap ver.
- Gereksiz uzun açıklama yapma; uygulanabilir öneriler ver.
- Cevapların Türkçe, profesyonel ve doğal olsun.
{{baseContext}}
""";
    }
}
