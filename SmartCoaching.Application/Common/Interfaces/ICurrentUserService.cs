using System;

namespace SmartCoaching.Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid TenantId { get; }
    string? UserId { get; }
    bool IsAuthenticated { get; }
}
