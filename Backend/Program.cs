using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Configure Key Vault integration
var keyVaultUri = new Uri(builder.Configuration["KeyVault:Uri"]);
var secretClient = new SecretClient(keyVaultUri, new DefaultAzureCredential());

builder.Configuration.AddAzureKeyVault(secretClient, new KeyVaultSecretManager());

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();
