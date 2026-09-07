# Stage 1: Build .NET Web API
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["ReservationSystem_backend.csproj", "./"]
RUN dotnet restore "ReservationSystem_backend.csproj"

# Copy full source and publish
COPY . .
RUN dotnet publish "ReservationSystem_backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Create uploads folder
RUN mkdir -p /app/wwwroot/Uploads

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "ReservationSystem_backend.dll"]
