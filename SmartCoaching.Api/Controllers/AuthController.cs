using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SmartCoaching.Application.Features.Auth.Commands.Login;
using SmartCoaching.Domain.Constants;
using System.Threading.Tasks;

namespace SmartCoaching.Api.Controllers;

public class AuthController(ISender sender) : ApiControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCoachCommand command)
    {
        return HandleResult(await sender.Send(command));
    }

    [HttpPost("athlete-login")]
    public async Task<IActionResult> AthleteLogin([FromBody] SmartCoaching.Application.Features.Auth.Commands.AthleteLogin.AthleteLoginCommand command)
    {
        return HandleResult(await sender.Send(command));
    }

    [Authorize(Roles = Roles.Athlete)]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] SmartCoaching.Application.Features.Auth.Commands.ChangePassword.ChangePasswordCommand command)
    {
        return HandleResult(await sender.Send(command));
    }
}
