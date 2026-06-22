using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Common.Interfaces;

public interface IAiService
{
    Task<string> GenerateInsightAsync(string teamDataJson, CancellationToken cancellationToken = default);
}
