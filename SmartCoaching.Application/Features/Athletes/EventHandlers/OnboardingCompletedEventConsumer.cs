using MassTransit;
using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application.Common.Events;
using SmartCoaching.Application.Common.Interfaces;
using System.Threading.Tasks;

namespace SmartCoaching.Application.Features.Athletes.EventHandlers;

public class OnboardingCompletedEventConsumer : IConsumer<OnboardingCompletedEvent>
{
    private readonly IEmailService _emailService;
    private readonly IApplicationDbContext _context;

    public OnboardingCompletedEventConsumer(IEmailService emailService, IApplicationDbContext context)
    {
        _emailService = emailService;
        _context = context;
    }

    public async Task Consume(ConsumeContext<OnboardingCompletedEvent> context)
    {
        var message = context.Message;
        
        // Find coach email
        var coach = await _context.Coaches.FirstOrDefaultAsync(c => c.Id == message.CoachId);
        if (coach == null) return;

        string subject = "Yeni Kayıt: Öğrenciniz Tanışma Formunu Doldurdu!";
        string body = $@"
            <html>
            <body>
                <h2>Merhaba {coach.FirstName},</h2>
                <p>Öğrenciniz <b>{message.AthleteFullName}</b> sisteme giriş yaptı ve Kayıt/Tanışma formunu doldurdu.</p>
                <p>Artık öğrencinizin boy, kilo, hedefler, sakatlık geçmişi gibi verilerini sistem üzerinden inceleyebilir ve programını hazırlayabilirsiniz.</p>
                <br>
                <p>İyi çalışmalar,<br>SmartCoaching Sistemi</p>
            </body>
            </html>
        ";

        await _emailService.SendEmailAsync(coach.Email, subject, body);
    }
}
