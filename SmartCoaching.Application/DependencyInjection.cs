using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using SmartCoaching.Application.Behaviors;

namespace SmartCoaching.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(DependencyInjection).Assembly;

        // MediatR kütüphanesini ve bizim yazdığımız Validation (Doğrulama) filtresini sisteme tanıtıyoruz.
        services.AddMediatR(configuration =>
        {
            configuration.RegisterServicesFromAssembly(assembly);
            configuration.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        // FluentValidation kurallarını otomatik bulması için
        services.AddValidatorsFromAssembly(assembly);

        return services;
    }
}
