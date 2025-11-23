using Microsoft.AspNetCore.Mvc;
using VicShopAPI.Controllers;
using Xunit;

namespace VicShopAPI.Tests.Controllers;

public class OrdersControllerTests
{
    private readonly OrdersController _controller;

    public OrdersControllerTests()
    {
        _controller = new OrdersController();
    }

    [Fact]
    public void CreateOrder_ReturnsOkResult()
    {
        // Act
        var result = _controller.CreateOrder();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }
}
