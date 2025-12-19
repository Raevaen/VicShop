using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using VicShopAPI.Controllers;
using VicShopAPI.Models;
using VicShopAPI.Repositories;
using Xunit;
using Microsoft.AspNetCore.Http;

namespace VicShopAPI.Tests.Controllers;

public class OrdersControllerTests
{
    private readonly Mock<IOrderRepository> _mockRepo;
    private readonly OrdersController _controller;

    public OrdersControllerTests()
    {
        _mockRepo = new Mock<IOrderRepository>();
        _controller = new OrdersController(_mockRepo.Object);

        // Mock User Claims
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, "test-user-id"),
        }, "mock"));

        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };
    }

    [Fact]
    public async Task CreateOrder_ReturnsCreated_WhenOrderIsValid()
    {
        // Arrange
        var order = new Order { TotalAmountCents = 1000, Items = new List<OrderItem>() };

        // Act
        var result = await _controller.CreateOrder(order);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        var returnOrder = Assert.IsType<Order>(createdResult.Value);
        Assert.Equal("test-user-id", returnOrder.UserId);
        _mockRepo.Verify(r => r.CreateAsync(It.IsAny<Order>()), Times.Once);
    }

    [Fact]
    public async Task GetMyOrders_ReturnsOk_WithListOfOrders()
    {
        // Arrange
        var orders = new List<Order> { new Order { Id = "order1", UserId = "test-user-id" } };
        _mockRepo.Setup(r => r.GetByUserIdAsync("test-user-id")).ReturnsAsync(orders);

        // Act
        var result = await _controller.GetMyOrders();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnOrders = Assert.IsType<List<Order>>(okResult.Value);
        Assert.Single(returnOrders);
    }
}
