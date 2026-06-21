using MediatR;
using SmartCoaching.Domain.Common;
using System.Collections.Generic;

namespace SmartCoaching.Application.Features.Athletes.Queries.GetAthletes;

// İçeriye hiç parametre almayan, geriye Sporcu listesi dönen basit bir okuma (Query) komutu
public record GetAthletesQuery() : IRequest<Result<List<AthleteDto>>>;
