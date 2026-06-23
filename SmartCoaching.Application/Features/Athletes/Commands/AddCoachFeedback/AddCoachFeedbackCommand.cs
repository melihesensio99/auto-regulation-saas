using MediatR;
using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Application.Features.Athletes.Commands.AddCoachFeedback;

public record AddCoachFeedbackCommand(
    Guid AthleteId,
    Guid CheckInId,
    string Feedback
) : IRequest<Result>;
