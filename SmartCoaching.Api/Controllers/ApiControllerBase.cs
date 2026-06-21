using Microsoft.AspNetCore.Mvc;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    protected IActionResult HandleResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return result.Error.Type switch
        {
            ErrorType.NotFound => NotFound(result.Error),
            ErrorType.Conflict => Conflict(result.Error),
            ErrorType.Unauthorized => Unauthorized(result.Error),
            ErrorType.Validation => BadRequest(result.Error),
            _ => BadRequest(result.Error)
        };
    }

    protected IActionResult HandleResult(Result result)
    {
        if (result.IsSuccess)
        {
            return Ok(); // Geriye veri dönmeyen (DTO Kusmayan) düz başarılı cevap
        }

        return result.Error.Type switch
        {
            ErrorType.NotFound => NotFound(result.Error),
            ErrorType.Conflict => Conflict(result.Error),
            ErrorType.Unauthorized => Unauthorized(result.Error),
            ErrorType.Validation => BadRequest(result.Error),
            _ => BadRequest(result.Error)
        };
    }
}
