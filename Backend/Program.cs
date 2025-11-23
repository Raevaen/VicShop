using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using MongoDB.Driver;
using VicShopAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configure Key Vault integration
var keyVaultUri = new Uri(builder.Configuration["KeyVault:Uri"]);
var secretClient = new SecretClient(keyVaultUri, new DefaultAzureCredential());

builder.Configuration.AddAzureKeyVault(secretClient, new KeyVaultSecretManager());

// Retrieve MongoDB connection string from Key Vault
var mongoConnectionString = secretClient.GetSecret("MongoConnection").Value.Value;
builder.Configuration["MongoDB:ConnectionString"] = mongoConnectionString;

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(builder.Configuration["MongoDB:ConnectionString"]));
builder.Services.AddSingleton<IMongoDatabase>(sp => sp.GetRequiredService<IMongoClient>().GetDatabase(builder.Configuration["MongoDB:Database"]));
builder.Services.AddSingleton<IProductRepository, ProductRepository>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapControllers();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.Run();
