using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using SmartCoaching.Application.Common.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartCoaching.Infrastructure.Services;

public class SmtpEmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IOptions<EmailSettings> options, ILogger<SmtpEmailService> logger)
    {
        _emailSettings = options.Value;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body, CancellationToken cancellationToken = default)
    {
        try
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromEmail));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = body };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            
            // Log message for debugging
            _logger.LogInformation("Attempting to send email to {ToEmail} via {Host}:{Port}", toEmail, _emailSettings.Host, _emailSettings.Port);

            await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls, cancellationToken);
            await smtp.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password, cancellationToken);
            await smtp.SendAsync(email, cancellationToken);
            await smtp.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("Email sent successfully to {ToEmail}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {ToEmail}. Reason: {Message}", toEmail, ex.Message);
        }
    }
}
