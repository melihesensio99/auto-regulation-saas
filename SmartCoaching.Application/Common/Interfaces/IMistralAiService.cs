using System.Threading.Tasks;

namespace SmartCoaching.Application.Common.Interfaces;

public interface IMistralAiService
{
    Task<string> GenerateWeeklyAnalysisAsync(string prompt);
}
