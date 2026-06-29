using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.Google;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Common.Interfaces.AI;
using SmartCoaching.Infrastructure.AI.Plugins;

namespace SmartCoaching.Infrastructure.AI.Agents;

public abstract class BaseCoachAgentExecutor : ICoachAgentExecutor
{
    private readonly IApplicationDbContext _context;
    private readonly IAgentCoachContext _coachContext;
    private readonly IAgentToolResultTracker _toolResultTracker;
    private readonly ISender _sender;

    protected BaseCoachAgentExecutor(
        IApplicationDbContext context,
        IAgentCoachContext coachContext,
        IAgentToolResultTracker toolResultTracker,
        ISender sender)
    {
        _context = context;
        _coachContext = coachContext;
        _toolResultTracker = toolResultTracker;
        _sender = sender;
    }

    public abstract CoachAgentRoute Route { get; }

    public async Task<AgentResponse> ExecuteAsync(CoachAgentExecutionContext context)
    {
        var builder = Kernel.CreateBuilder();
        builder.AddGoogleAIGeminiChatCompletion(
            modelId: context.ModelId,
            apiKey: context.ApiKey);

        RegisterPlugins(builder);

        var kernel = builder.Build();
        var chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();

        var chatHistory = new ChatHistory(BuildSystemPrompt(context.ContextAthleteId, context.ContextAthleteName));
        chatHistory.AddUserMessage(context.Message);

        var executionSettings = new GeminiPromptExecutionSettings
        {
            ToolCallBehavior = GeminiToolCallBehavior.AutoInvokeKernelFunctions
        };

        var result = await chatCompletionService.GetChatMessageContentAsync(
            chatHistory,
            executionSettings: executionSettings,
            kernel: kernel,
            cancellationToken: context.CancellationToken);

        var finalReply = result.Content ?? "Şu an net bir cevap üretemedim. İstersen isteğini biraz daha netleştirip tekrar deneyelim.";
        var lastAction = _toolResultTracker.GetRecordedActions().LastOrDefault();

        return new AgentResponse
        {
            TextReply = finalReply,
            UiAction = lastAction?.Action,
            ActionData = lastAction?.Data
        };
    }

    protected void AddAthletePlugin(IKernelBuilder builder)
    {
        builder.Plugins.AddFromObject(new AthletePlugin(_context, _coachContext), nameof(AthletePlugin));
    }

    protected void AddNutritionPlugin(IKernelBuilder builder)
    {
        builder.Plugins.AddFromObject(
            new NutritionPlugin(_context, _sender, _coachContext, _toolResultTracker),
            nameof(NutritionPlugin));
    }

    protected void AddCoachProgramPlugin(IKernelBuilder builder)
    {
        builder.Plugins.AddFromObject(
            new CoachProgramPlugin(_sender, _toolResultTracker),
            nameof(CoachProgramPlugin));
    }

    protected static string BuildContextPrompt(System.Guid? contextAthleteId, string? contextAthleteName)
    {
        if (!contextAthleteId.HasValue || string.IsNullOrWhiteSpace(contextAthleteName))
        {
            return """
Ek bağlam:
- Koç herhangi bir sporcu adı vermediyse önce sporcu listesinden doğru kişiyi bul.
""";
        }

        return $$"""
Önemli bağlam:
- Koç şu anda {{contextAthleteName}} isimli sporcunun profilindedir.
- Bu sporcu için kullanılacak varsayılan ID: {{contextAthleteId.Value}}
- Koç isim vermeden "kalorisini artır", "programını güncelle", "bugünü yorumla" gibi bir komut verirse bunu doğrudan {{contextAthleteName}} için uygula.
""";
    }

    protected abstract void RegisterPlugins(IKernelBuilder builder);
    protected abstract string BuildSystemPrompt(System.Guid? contextAthleteId, string? contextAthleteName);
}
