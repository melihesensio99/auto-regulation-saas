using FluentValidation;
using MediatR;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Application.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : Result
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);

        // 1. DÜZELTME: Senkron (Validate) yerine Asenkron (ValidateAsync) kullanıldı.
        // Bu sayede veritabanına giden kurallar (Örn: Email kullanımda mı?) thread'i bloklamadan çalışabilir.
        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var errors = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .Select(f => new Error(f.PropertyName, f.ErrorMessage))
            .Distinct()
            .ToArray();

        if (errors.Any())
        {
            var error = errors.First();

            // 2. DÜZELTME: Tip Güvenliği (Reflection kullanımı)
            // Eğer dönen tip Result<T> ise (Örn: Result<Guid>) o tipi bulup dinamik olarak doğru Result nesnesini üretiyoruz.
            if (typeof(TResponse).IsGenericType &&
                typeof(TResponse).GetGenericTypeDefinition() == typeof(Result<>))
            {
                var resultType = typeof(TResponse).GetGenericArguments()[0]; // T tipini (Örn: Guid) yakala
                
                // Result sınıfındaki jenerik Failure<T> metodunu bul ve çalıştır
                var failureMethod = typeof(Result)
                    .GetMethods()
                    .First(m => m.Name == nameof(Result.Failure) && m.IsGenericMethod)
                    .MakeGenericMethod(resultType);

                return (TResponse)failureMethod.Invoke(null, new object[] { error })!;
            }

            // Eğer düz Result ise (geriye veri dönmüyorsa) normal şekilde dön
            return (TResponse)(object)Result.Failure(error);
        }

        return await next();
    }
}
