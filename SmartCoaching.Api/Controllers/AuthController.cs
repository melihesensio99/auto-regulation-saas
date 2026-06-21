using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartCoaching.Application.Features.Auth.Commands.Login;
using System.Threading.Tasks;

namespace SmartCoaching.Api.Controllers;

public class AuthController(ISender sender) : ApiControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCoachCommand command)
    {
        return HandleResult(await sender.Send(command));
    }
}
