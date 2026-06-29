using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Common.Interfaces;

public interface IAiService
{
    Task<string> CalculateMacrosAsync(string jsonPayload, CancellationToken cancellationToken = default);
}
