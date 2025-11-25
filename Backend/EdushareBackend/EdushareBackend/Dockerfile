# -------------------------
# Base image (runtime)
# -------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS base
WORKDIR /app
EXPOSE 5001

# -------------------------
# Build stage
# -------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Másoljuk az összes projektet
COPY EdushareBackend/ ./EdushareBackend/
COPY Logic/ ./Logic/
COPY Data/ ./Data/
COPY Entities/ ./Entities/

# Lépjünk be a backend projekt könyvtárába
WORKDIR /src/EdushareBackend

# Restore
RUN dotnet restore "EdushareBackend.csproj"

# Build
RUN dotnet build -c $BUILD_CONFIGURATION -o /app/build

# -------------------------
# Publish stage
# -------------------------
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR /src/EdushareBackend
RUN dotnet publish "EdushareBackend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# -------------------------
# Final stage (runtime)
# -------------------------
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EdushareBackend.dll"]
