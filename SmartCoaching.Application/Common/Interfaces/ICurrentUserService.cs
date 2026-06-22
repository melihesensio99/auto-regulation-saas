using System;

namespace SmartCoaching.Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid TenantId { get; }
    string? UserId { get; }
    string? Role { get; }
    bool IsAuthenticated { get; }
}
