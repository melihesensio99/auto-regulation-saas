using MassTransit;
using SmartCoaching.Application.Common.Events;
using SmartCoaching.Application.Common.Interfaces;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.EventHandlers;

public class AthleteCreatedEventConsumer : IConsumer<AthleteCreatedEvent>
{
    private readonly IEmailService _emailService;

    public AthleteCreatedEventConsumer(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public async Task Consume(ConsumeContext<AthleteCreatedEvent> context)
    {
        var message = context.Message;

        string subject = "SmartCoaching'e Hoş Geldiniz!";
        string body = $@"
            <html>
            <body>
                <h2>Merhaba {message.FirstName},</h2>
                <p>Koçunuz sizi SmartCoaching sistemine ekledi.</p>
                <p>Aşağıdaki bilgilerle mobil uygulamamıza giriş yapabilirsiniz:</p>
                <ul>
                    <li><b>E-posta:</b> {message.Email}</li>
                    <li><b>Geçici Şifre:</b> {message.TemporaryPassword}</li>
                </ul>
                <p>Güvenliğiniz için uygulamaya giriş yaptıktan sonra profil ayarlarınızdan şifrenizi değiştirebilirsiniz.</p>
                <p style=""color: #d97706; font-weight: bold;"">ÖNEMLİ: Sisteme ilk girişinizde karşınıza çıkacak olan Kayıt ve Tanışma Formunu doldurmanız gerekmektedir (Boy, kilo, hedefleriniz, sakatlık durumunuz vb.). Koçunuz, formunuzu doldurduktan sonra programınızı hazırlayacaktır.</p>
                <br>
                <p>Sağlıklı günler dileriz,<br>SmartCoaching Ekibi</p>
            </body>
            </html>
        ";

        await _emailService.SendEmailAsync(message.Email, subject, body);
    }
}
