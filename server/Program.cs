using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using BCrypt.Net;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Auth.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuraci�n de la conexi�n a la base de datos
builder.Configuration.SetBasePath(AppDomain.CurrentDomain.BaseDirectory);
builder.Configuration.AddJsonFile("appsettings.json");
var configuration = builder.Configuration.GetSection("DatabaseSettings");
var connectionString = "Server=mysql;Database=whatsapp_post_auto;User=root;Password=root;Port=3306;";

var corsPolicy = new CorsPolicyBuilder(builder.Environment.ApplicationName)
    .WithOrigins("https://whatsapp.limpiolux.com")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    .Build();

builder.Services.AddCors(options =>
{
    options.AddPolicy(builder.Environment.ApplicationName, corsPolicy);
});

var app = builder.Build();

// Configuraci�n de la conexi�n a la base de datos
using var connection = new MySqlConnection(connectionString);
connection.Open();

Routes.MapRoutes(app, connection, connectionString);

app.UseCors(builder.Environment.ApplicationName);

app.Run("https://whatsapp.limpiolux.com:7129");
