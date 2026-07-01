using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Application.Common.Interfaces.AI;
using SmartCoaching.Infrastructure.Authentication;
using SmartCoaching.Infrastructure.Services;
using MassTransit;
using SmartCoaching.Application.Features.Athletes.EventHandlers;
using SmartCoaching.Infrastructure.AI;
using SmartCoaching.Infrastructure.AI.Agents;
using SmartCoaching.Infrastructure.Persistence;
using SmartCoaching.Infrastructure.Persistence.Seed;

namespace SmartCoaching.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IPasswordHasher, BCryptPasswordHasher>();
        services.AddSingleton<IJwtProvider, JwtProvider>();
        
        // Ai Service
        services.AddHttpClient<IAiService, MistralAiService>();
        
        // FatSecret Service & Caching
        services.AddMemoryCache();
        services.AddHttpClient<IFatSecretService, FatSecretService>();
        
        // AI Agent - Auth Context (coachId'yi JWT'den alır, LLM'den DEĞİL)
        services.AddScoped<IAgentCoachContext, AgentCoachContext>();
        services.AddScoped<IAgentToolResultTracker, AgentToolResultTracker>();
        services.AddScoped<ICoachAgentExecutor, NutritionCoachAgentExecutor>();
        services.AddScoped<ICoachAgentExecutor, WorkoutCoachAgentExecutor>();
        services.AddScoped<ICoachAgentExecutor, GeneralInsightCoachAgentExecutor>();

        // ApplicationDbContext & Seeder
        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<ExerciseSeeder>();
        
        // AI Agent Service
        services.AddScoped<IAiAgentService, GeminiAgentService>();

        // Email Service
        services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));
        services.AddTransient<IEmailService, SmtpEmailService>();

        // MassTransit (RabbitMQ)
        services.AddMassTransit(x =>
        {
            x.AddConsumer<AthleteCreatedEventConsumer>();
            x.AddConsumer<OnboardingCompletedEventConsumer>();
            x.AddConsumer<DietProgramUpdatedEventConsumer>();

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
