using MediatR;
using SmartCoaching.Domain.Common;
using System;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthleteProgressLogs;

public record GetAthleteProgressLogsQuery(
    Guid AthleteId,
    DateTime StartDate,
    DateTime EndDate
) : IRequest<Result<List<ProgressLogDto>>>;
