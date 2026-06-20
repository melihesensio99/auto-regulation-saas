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
        // Eğer bu istek için yazılmış bir kural (Validator) yoksa, kodu çalıştırmaya (next) devam et.
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);

        // Tüm kuralları çalıştır ve hataları topla
        var errors = _validators
            .Select(x => x.Validate(context))
            .SelectMany(x => x.Errors)
            .Where(x => x != null)
            .Select(x => new Error(x.PropertyName, x.ErrorMessage))
            .Distinct()
            .ToArray();

        // Eğer hata varsa, işlemi iptal et ve geriye anında Result.Failure dön!
        if (errors.Any())
        {
            var error = errors.First(); // Şimdilik sadece ilk hatayı döndürüyoruz.
            return (dynamic)Result.Failure(error); 
        }

        // Hata yoksa işlemi yapması için asıl metoda (Handler'a) geçiş yap.
        return await next();
    }
}
