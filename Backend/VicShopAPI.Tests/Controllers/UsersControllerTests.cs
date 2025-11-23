using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VicShopAPI.Controllers;
using Xunit;

namespace VicShopAPI.Tests.Controllers;

public class UsersControllerTests
{
    private readonly UsersController _controller;

    public UsersControllerTests()
    {
        _controller = new UsersController();
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Name, "Test User"),
            new Claim(ClaimTypes.NameIdentifier, "123")
        }, "mock"));

        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };
    }

    [Fact]
    public void GetMe_ReturnsOkResult_WithUserInfo()
    {
        // Act
        var result = _controller.GetMe();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }
}
