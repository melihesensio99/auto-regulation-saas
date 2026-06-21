using Microsoft.EntityFrameworkCore;
using SmartCoaching.Application;
using SmartCoaching.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Entity Framework Core (PostgreSQL) yapılandırması
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<SmartCoaching.Application.Common.Interfaces.IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

// Application katmanı servislerini (MediatR & FluentValidation) sisteme dahil ediyoruz
builder.Services.AddApplication();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
