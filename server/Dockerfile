# Utiliza una imagen oficial de .NET 6.0 como imagen base
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Auth.csproj", "."]
RUN dotnet restore "Auth.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "Auth.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Auth.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Agregar el certificado y la clave al contenedor
COPY certificate.crt /app/certificate.crt
COPY private.key /app/private.key

EXPOSE 7129
ENV ASPNETCORE_URLS=https://+:7129
ENV ASPNETCORE_HTTPS_PORT=7129
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/app/certificate.crt
ENV ASPNETCORE_Kestrel__Certificates__Default__KeyPath=/app/private.key
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=
ENTRYPOINT ["dotnet", "Auth.dll"]
