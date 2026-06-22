using MediatR;
using SmartCoaching.Domain.Common;

namespace SmartCoaching.Application.Features.Dashboard.Queries.GetCoachDashboardSummary;

public record GetCoachDashboardSummaryQuery() : IRequest<Result<CoachDashboardDto>>;
