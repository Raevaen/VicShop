using Microsoft.AspNetCore.Mvc;
using VicShopAPI.Controllers;
using Xunit;

namespace VicShopAPI.Tests.Controllers;

public class SampleControllerTests
{
    private readonly SampleController _controller;

    public SampleControllerTests()
    {
        _controller = new SampleController();
    }

    [Fact]
    public void GetSecureData_ReturnsOkResult()
    {
        // Act
        var result = _controller.GetSecureData();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }
}
