using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    private ISender _sender;

    // ISender'ı constructor yerine, doğrudan sistemden çekecek şekilde ayarlıyoruz.
    // Böylece her yeni Controller'da tek tek "base(sender)" demek zorunda kalmayacağız!
    protected ISender Sender => _sender ??= HttpContext.RequestServices.GetService<ISender>();

    // Sihirli metodumuz: Gelen Result kutusuna bakar, içindekine göre otomatik HTTP cevabı döner.
    protected IActionResult HandleResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            return Ok(result.Value); // Başarılıysa Yeşil 200 döner
        }

        return BadRequest(result.Error); // Hatalıysa Kırmızı 400 döner
    }
}
