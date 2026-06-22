using MediatR;
using Microsoft.Extensions.Logging;
using SmartCoaching.Application.Common.Interfaces;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;
    private readonly ICurrentUserService _currentUserService;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger, ICurrentUserService currentUserService)
    {
        _logger = logger;
        _currentUserService = currentUserService;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var userId = _currentUserService.TenantId.ToString();
        var userRole = _currentUserService.Role ?? "Anonim";

        _logger.LogInformation("SmartCoaching İsteği Başladı: {Name} {@UserId} {@UserRole} {@Request}",
            requestName, userId, userRole, request);

        var timer = new Stopwatch();
        timer.Start();

        var response = await next();

        timer.Stop();
        var elapsedMilliseconds = timer.ElapsedMilliseconds;

        if (elapsedMilliseconds > 500)
        {
            _logger.LogWarning("SmartCoaching Yavaş İstek: {Name} ({ElapsedMilliseconds} ms) {@UserId} {@Request}",
                requestName, elapsedMilliseconds, userId, request);
        }

        _logger.LogInformation("SmartCoaching İsteği Tamamlandı: {Name} ({ElapsedMilliseconds} ms)", requestName, elapsedMilliseconds);

        return response;
    }
}
