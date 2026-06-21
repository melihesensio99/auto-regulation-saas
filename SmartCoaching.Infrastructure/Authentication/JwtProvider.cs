using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Domain.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SmartCoaching.Infrastructure.Authentication;

public sealed class JwtProvider : IJwtProvider
{
    private readonly JwtOptions _options;

    public JwtProvider(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public string Generate(Coach coach)
    {
        var claims = new Claim[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, coach.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, coach.Email),
            // Buradaki Custom Claim ile CoachId'yi token içine gömüyoruz
            new Claim("tenantId", coach.TenantId.ToString()) 
        };

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _options.Issuer,
            _options.Audience,
            claims,
            null,
            DateTime.UtcNow.AddHours(12),
            signingCredentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
