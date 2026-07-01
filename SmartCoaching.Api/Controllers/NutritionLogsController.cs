using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCoaching.Application.Features.Nutrition.Commands.AnalyzeFoodImage;
using SmartCoaching.Application.Features.Nutrition.Commands.LogConsumedFood;
using SmartCoaching.Application.Features.Nutrition.Queries.GetDailyNutrition;
using SmartCoaching.Application.Features.Nutrition.Queries.SearchFoodInFatSecret;
using SmartCoaching.Domain.Constants;
using System;
using System.Threading.Tasks;

namespace SmartCoaching.Api.Controllers;

[ApiController]
[Route("api/nutrition")]
[Authorize]
public class NutritionLogsController : ControllerBase
{
    private readonly IMediator _mediator;

    public NutritionLogsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("log")]
    [Authorize(Roles = Roles.Athlete)]
    public async Task<IActionResult> LogConsumedFood([FromBody] LogConsumedFoodCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(new { id = result });
    }

    [HttpGet("daily/{date}")]
    [Authorize(Roles = Roles.Athlete)]
    public async Task<IActionResult> GetDailyNutrition(DateTime date)
    {
        var result = await _mediator.Send(new GetDailyNutritionQuery(date));
        return Ok(result);
    }

    [HttpGet("fatsecret/search")]
    public async Task<IActionResult> SearchFatSecret([FromQuery] string query)
    {
        var result = await _mediator.Send(new SearchFoodInFatSecretQuery(query));
        return Ok(result);
    }

    [HttpPost("analyze-image")]
    [Authorize(Roles = Roles.Athlete)]
    public async Task<IActionResult> AnalyzeFoodImage([FromBody] AnalyzeFoodImageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Base64Image))
            return BadRequest("Image is required.");

        var result = await _mediator.Send(new AnalyzeFoodImageCommand(request.Base64Image));
        
        if (result == null)
            return BadRequest("Failed to analyze image.");

        return Ok(result);
    }
}

public class AnalyzeFoodImageRequest
{
    public string Base64Image { get; set; } = string.Empty;
}
