using SmartCoaching.Domain.Entities;

namespace SmartCoaching.Application.Common.Interfaces;

public interface IJwtProvider
{
    string Generate(Coach coach);
}
