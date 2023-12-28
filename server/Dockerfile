# Usa la imagen oficial de SDK de ASP.NET Core como base para construir la aplicación
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# Establece el directorio de trabajo en /src
WORKDIR /src

# Copia los archivos del proyecto al contenedor
COPY . .

# Restaura las dependencias y compila la aplicación en modo Release
RUN dotnet restore
RUN dotnet publish -c Release -o /app

# Crea una imagen más liviana usando la imagen oficial de ASP.NET Core Runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos publicados de la compilación anterior al contenedor
COPY --from=build /app .

# Expone el puerto 80 para las solicitudes HTTP
EXPOSE 7129

# Define la instrucción para ejecutar tu aplicación al iniciar el contenedor
ENTRYPOINT ["dotnet", "Auth.dll"]
