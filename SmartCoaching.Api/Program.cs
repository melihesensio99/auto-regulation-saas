using Microsoft.EntityFrameworkCore;
using Serilog;
using SmartCoaching.Api;
using SmartCoaching.Application;
using SmartCoaching.Application.Common.Interfaces;
using SmartCoaching.Infrastructure;
using SmartCoaching.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Serilog Yapılandırması
builder.Host.UseSerilog((context, loggerConfig) =>
{
    loggerConfig.ReadFrom.Configuration(context.Configuration);
});

// Dependency Injection (Katmanların Servis Kayıtları)
builder.Services.AddApiServices(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Entity Framework Core (PostgreSQL) yapılandırması
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

var app = builder.Build();

// Veritabanı Seed ve Düzeltme İşlemleri
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SmartCoaching.Infrastructure.Persistence.ApplicationDbContext>();
    
    // Eksik olan sütunu EF Core Migration'ları atladığı için manuel ekliyoruz:
    try 
    {
        Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.ExecuteSqlRaw(
            context.Database, 
            "ALTER TABLE \"Athletes\" ADD COLUMN IF NOT EXISTS \"MustChangePassword\" boolean NOT NULL DEFAULT false;");
    } 
    catch (Exception ex) 
    {
        Console.WriteLine("Sütun eklenirken hata veya zaten var: " + ex.Message);
    }

    var exerciseSeeder = scope.ServiceProvider.GetRequiredService<SmartCoaching.Infrastructure.Persistence.Seed.ExerciseSeeder>();
    await exerciseSeeder.SeedAsync();
}

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

// GLOBAL EXCEPTION Kalkanımızı devreye alıyoruz. Artık tüm istekler bu filtreden geçecek.
app.UseMiddleware<SmartCoaching.Api.Middlewares.GlobalExceptionMiddleware>();

// Serilog Request Logging (Gelen isteklerin loglanması)
app.UseSerilogRequestLogging();

// CORS Kalkanını Aktif Et
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
