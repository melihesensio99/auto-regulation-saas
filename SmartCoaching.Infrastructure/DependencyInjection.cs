using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Infrastructure.Authentication;
using SmartCoaching.Infrastructure.Services;

namespace SmartCoaching.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IPasswordHasher, BCryptPasswordHasher>();
        services.AddSingleton<IJwtProvider, JwtProvider>();
        
        services.AddHttpClient<IAiService, MistralAiService>();
        
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

        return services;
    }
}
