
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using BCrypt.Net;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Auth.Models;
using System.Data;

public static class Routes
{
    public static void MapRoutes(this WebApplication app, MySqlConnection connection, string connectionString)
    {
        // Endpoint /register
        app.MapPost("/register", async (HttpContext context, [FromBody] User user) =>
        {
            var nombre = user.Nombre;
            var mail = user.Mail;
            var contraseña = user.Contraseña;

            // Verificar si el correo ya está registrado
            var checkEmailQuery = "SELECT * FROM users WHERE mail = @Mail";
            using var checkEmailCommand = new MySqlCommand(checkEmailQuery, connection);
            checkEmailCommand.Parameters.AddWithValue("@Mail", mail);

            // Usar un DataReader para verificar si hay filas con el mismo correo
            using var reader = await checkEmailCommand.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(new { error = "El correo ya está registrado. Por favor, elija otro correo." });

                // Cerrar el DataReader antes de salir del método
                await reader.CloseAsync();
                return;
            }

            // Cerrar el DataReader antes de ejecutar otra consulta
            await reader.CloseAsync();

            // Encriptar la contraseña antes de almacenarla
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(contraseña);

            // Insertar el usuario en la base de datos
            var insertUserQuery = "INSERT INTO users (nombre, mail, contraseña) VALUES (@Nombre, @Mail, @Contraseña)";
            using var insertUserCommand = new MySqlCommand(insertUserQuery, connection);
            insertUserCommand.Parameters.AddWithValue("@Nombre", nombre);
            insertUserCommand.Parameters.AddWithValue("@Mail", mail);
            insertUserCommand.Parameters.AddWithValue("@Contraseña", hashedPassword);

            await insertUserCommand.ExecuteNonQueryAsync();

            context.Response.StatusCode = 201;
            await context.Response.WriteAsJsonAsync(new { message = "Usuario registrado exitosamente" });
        });

        // Endpoint /login
        app.MapPost("/login", async (HttpContext context, [FromBody] User user) =>
        {
            var mail = user.Mail;
            var contraseña = user.Contraseña;

            // Verificar si el correo existe en la base de datos
            var getUserQuery = "SELECT id, nombre, mail, contraseña FROM users WHERE mail = @Mail";
            using var getUserCommand = new MySqlCommand(getUserQuery, connection);
            getUserCommand.Parameters.AddWithValue("@Mail", mail);

            using var reader = await getUserCommand.ExecuteReaderAsync();
            if (!reader.HasRows)
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsJsonAsync(new { error = "Credenciales inválidas. Revise bien el correo y la contraseña." });
                return;
            }

            // Verificar la contraseña
            await reader.ReadAsync();
            var id = reader.GetInt32("id");
            var nombre = reader.GetString("nombre");
            var storedPassword = reader["contraseña"].ToString();
            var passwordMatch = BCrypt.Net.BCrypt.Verify(contraseña, storedPassword);

            if (passwordMatch)
            {
                context.Response.StatusCode = 200;
                await context.Response.WriteAsJsonAsync(new
                {
                    message = "Inicio de sesión exitoso",
                    id = id,
                    nombre = nombre,
                    mail = mail
                });
            }
            else
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsJsonAsync(new { error = "Credenciales inválidas. Revise bien el correo y la contraseña." });
            }
        });


        app.MapPost("/enviar-mensaje", async (HttpContext context, [FromBody] Mensaje mensaje) =>
        {
            var idUser = mensaje.IdUser;
            var numeros = mensaje.Numeros;
            var contenidoMensaje = mensaje.ContenidoMensaje;
            var numeroEmisor = mensaje.NumeroEmisor;  // Nuevo campo en el modelo Mensaje

            // Contar la cantidad de números en la cadena
            var totalDeMensajes = numeros.Split(',').Length;

            // Insertar el mensaje en la base de datos
            var insertMensajeQuery = "INSERT INTO mensajes (id_user, numeros, mensaje, totaldemensajes, numero_emisor) VALUES (@IdUser, @Numeros, @ContenidoMensaje, @TotalDeMensajes, @NumeroEmisor)";
            using var insertMensajeCommand = new MySqlCommand(insertMensajeQuery, connection);
            insertMensajeCommand.Parameters.AddWithValue("@IdUser", idUser);
            insertMensajeCommand.Parameters.AddWithValue("@Numeros", numeros);
            insertMensajeCommand.Parameters.AddWithValue("@ContenidoMensaje", contenidoMensaje);
            insertMensajeCommand.Parameters.AddWithValue("@TotalDeMensajes", totalDeMensajes);
            insertMensajeCommand.Parameters.AddWithValue("@NumeroEmisor", numeroEmisor);

            await insertMensajeCommand.ExecuteNonQueryAsync();

            context.Response.StatusCode = 201;
            await context.Response.WriteAsJsonAsync(new { message = "Mensaje enviado exitosamente" });
        });


        app.MapGet("/obtener-mensajes", async (HttpContext context) =>
        {
            // Crear una nueva conexión para esta solicitud
            using (var connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();

                // Obtener el parámetro de rango de fechas desde la consulta
                var rangoDias = context.Request.Query["rangoDias"].ToString();

                // Determinar la fecha de inicio según el rango deseado
                DateTime fechaInicio;
                switch (rangoDias)
                {
                    case "7":
                        fechaInicio = DateTime.Now.AddDays(-7);
                        break;
                    case "30":
                        fechaInicio = DateTime.Now.AddDays(-30);
                        break;
                    default:
                        fechaInicio = DateTime.MinValue; // Obtener todos los mensajes
                        break;
                }

                // Consultar la base de datos para obtener los mensajes según el rango de fechas
                var obtenerMensajesQuery = "SELECT id, id_user, numeros, mensaje, totaldemensajes, fecha_creacion FROM mensajes WHERE fecha_creacion >= @FechaInicio";
                using (var obtenerMensajesCommand = new MySqlCommand(obtenerMensajesQuery, connection))
                {
                    obtenerMensajesCommand.Parameters.AddWithValue("@FechaInicio", fechaInicio);

                    using (var reader = await obtenerMensajesCommand.ExecuteReaderAsync())
                    {
                        var mensajes = new List<Mensaje>();

                        while (await reader.ReadAsync())
                        {
                            var mensaje = new Mensaje
                            {
                                Id = reader.GetInt32("id"),
                                IdUser = reader.GetInt32("id_user"),
                                Numeros = reader.GetString("numeros"),
                                ContenidoMensaje = reader.IsDBNull(reader.GetOrdinal("mensaje")) ? null : reader.GetString("mensaje"),
                                TotalDeMensajes = reader.GetInt32("totaldemensajes"),
                                FechaCreacion = reader.GetDateTime("fecha_creacion")
                            };

                            mensajes.Add(mensaje);
                        }

                        context.Response.StatusCode = 200;
                        await context.Response.WriteAsJsonAsync(mensajes);
                    }
                }
            }
        });

    }
}
