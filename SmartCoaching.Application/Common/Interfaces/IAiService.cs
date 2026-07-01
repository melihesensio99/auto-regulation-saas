using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Common.Interfaces;

public interface IAiService
{
    Task<string> CalculateMacrosAsync(string jsonPayload, CancellationToken cancellationToken = default);
    Task<string> EstimateFoodFromImageAsync(string base64Image, CancellationToken cancellationToken = default);
}
