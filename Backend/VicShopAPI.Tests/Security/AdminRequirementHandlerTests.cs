using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using VicShopAPI.Security;
using Xunit;

namespace VicShopAPI.Tests.Security;

public class AdminRequirementHandlerTests
{
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly Mock<ILogger<AdminRequirementHandler>> _mockLogger;
    private readonly AdminRequirementHandler _handler;

    public AdminRequirementHandlerTests()
    {
        _mockConfig = new Mock<IConfiguration>();
        _mockLogger = new Mock<ILogger<AdminRequirementHandler>>();
        _handler = new AdminRequirementHandler(_mockConfig.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task HandleAsync_Succeeds_WhenUserIsInWhitelist()
    {
        // Arrange
        _mockConfig.Setup(c => c["AdminWhitelist"]).Returns("admin@test.com,other@test.com");
        
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] 
        { 
            new Claim("preferred_username", "admin@test.com") 
        }, "mock"));
        
        var context = new AuthorizationHandlerContext(
            new[] { new AdminRequirement() }, 
            user, 
            null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task HandleAsync_Fails_WhenUserIsNotInWhitelist()
    {
        // Arrange
        _mockConfig.Setup(c => c["AdminWhitelist"]).Returns("admin@test.com");
        
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] 
        { 
            new Claim("preferred_username", "hacker@test.com") 
        }, "mock"));
        
        var context = new AuthorizationHandlerContext(
            new[] { new AdminRequirement() }, 
            user, 
            null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }

    [Fact]
    public async Task HandleAsync_Fails_WhenNoEmailClaim()
    {
        // Arrange
        _mockConfig.Setup(c => c["AdminWhitelist"]).Returns("admin@test.com");
        
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] { }, "mock"));
        
        var context = new AuthorizationHandlerContext(
            new[] { new AdminRequirement() }, 
            user, 
            null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }
}
