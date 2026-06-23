using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Common.Interfaces;

public interface IAiService
{
    Task<string> GenerateInsightAsync(string teamDataJson, CancellationToken cancellationToken = default);
    Task<string> GenerateWeeklyAnalysisAsync(string prompt, CancellationToken cancellationToken = default);
}
