using MassTransit;
using SmartCoaching.Application.Common.Events;
using SmartCoaching.Application.Common.Interfaces;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.EventHandlers;

public class ProgramPublishedEventConsumer : IConsumer<ProgramPublishedEvent>
{
    private readonly IEmailService _emailService;

    public ProgramPublishedEventConsumer(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public async Task Consume(ConsumeContext<ProgramPublishedEvent> context)
    {
        var message = context.Message;
        
        string subject = "Yeni Programınız Hazır!";
        string body = $@"
            <html>
            <body>
                <h2>Merhaba {message.AthleteFullName},</h2>
                <p>Koçunuz antrenman ve beslenme programlarınızı başarıyla sisteme girdi ve güncelledi.</p>
                <p>Hemen mobil uygulamamıza veya web sitemize giriş yaparak yeni hedeflerinizi ve planınızı inceleyebilirsiniz.</p>
                <br>
                <p>Başarılar dileriz,<br>SmartCoaching Ekibi</p>
            </body>
            </html>
        ";

        await _emailService.SendEmailAsync(message.AthleteEmail, subject, body);
    }
}
