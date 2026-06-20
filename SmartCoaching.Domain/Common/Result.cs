namespace SmartCoaching.Domain.Common;

public class Result
{
    protected internal Result(bool isSuccess, Error error)
    {
        // Eğer başarılıysa ama hata gönderilmişse, bu bir yazılım mantık hatasıdır.
        if (isSuccess && error != Error.None)
        {
            throw new InvalidOperationException();
        }

        // Eğer başarısızsa ama hiç hata gönderilmemişse, bu da bir mantık hatasıdır.
        if (!isSuccess && error == Error.None)
        {
            throw new InvalidOperationException();
        }

        IsSuccess = isSuccess;
        Error = error;
    }

    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public Error Error { get; }

    // Başarılı bir sonuç döndürmek için
    public static Result Success() => new(true, Error.None);
    
    // Başarısız bir sonuç döndürmek için (hata detayıyla birlikte)
    public static Result Failure(Error error) => new(false, error);
    
    // Değer döndüren (Örn: Result<Athlete>) başarılı sonuçlar için
    public static Result<TValue> Success<TValue>(TValue value) => new(value, true, Error.None);
    
    // Değer döndüren ama başarısız olan sonuçlar için
    public static Result<TValue> Failure<TValue>(Error error) => new(default, false, error);
}

// Jenerik versiyon (Geriye sadece "başarılı/başarısız" değil, ekstra bir veri de döndürmek istediğimizde kullanırız)
public class Result<TValue> : Result
{
    private readonly TValue? _value;

    protected internal Result(TValue? value, bool isSuccess, Error error)
        : base(isSuccess, error)
    {
        _value = value;
    }

    public TValue Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException("Başarısız bir sonucun (failure) değerine erişilemez.");
}
