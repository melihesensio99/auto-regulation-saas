using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Infrastructure.Authentication;
using SmartCoaching.Infrastructure.Services;
using MassTransit;
using SmartCoaching.Application.Features.Athletes.EventHandlers;

namespace SmartCoaching.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IPasswordHasher, BCryptPasswordHasher>();
        services.AddSingleton<IJwtProvider, JwtProvider>();
        
        // Ai Service
        services.AddHttpClient<IAiService, MistralAiService>();

        // Email Service
        services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));
        services.AddTransient<IEmailService, SmtpEmailService>();

        // MassTransit (RabbitMQ)
        services.AddMassTransit(x =>
        {
            x.AddConsumer<AthleteCreatedEventConsumer>();
            x.AddConsumer<WeeklyCheckInSubmittedEventConsumer>();

            x.UsingRabbitMq((context, cfg) =>
            {
                // Localhost default RabbitMQ (Guest/Guest)
                cfg.Host("localhost", "/", h =>
                {
                    h.Username("guest");
                    h.Password("guest");
                });

                cfg.ConfigureEndpoints(context);
            });
        });
        
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

        return services;
    }
}
