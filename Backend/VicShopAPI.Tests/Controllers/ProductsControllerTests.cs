using Microsoft.AspNetCore.Mvc;
using Moq;
using VicShopAPI.Controllers;
using VicShopAPI.Models;
using VicShopAPI.Repositories;
using Xunit;

namespace VicShopAPI.Tests.Controllers;

public class ProductsControllerTests
{
    private readonly Mock<IProductRepository> _mockRepo;
    private readonly ProductsController _controller;

    public ProductsControllerTests()
    {
        _mockRepo = new Mock<IProductRepository>();
        _controller = new ProductsController(_mockRepo.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult_WithListOfProducts()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = "1", Title = "Product 1", Slug = "product-1" },
            new Product { Id = "2", Title = "Product 2", Slug = "product-2" }
        };
        _mockRepo.Setup(repo => repo.GetAllAsync(It.IsAny<string?>(), It.IsAny<string?>())).ReturnsAsync(products);

        // Act
        var result = await _controller.GetAll(null, null);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnProducts = Assert.IsType<List<Product>>(okResult.Value);
        Assert.Equal(2, returnProducts.Count);
    }

    [Fact]
    public async Task GetBySlug_ReturnsOkResult_WhenProductExists()
    {
        // Arrange
        var slug = "test-product";
        var product = new Product { Id = "1", Title = "Test Product", Slug = slug };
        _mockRepo.Setup(repo => repo.GetBySlugAsync(slug)).ReturnsAsync(product);

        // Act
        var result = await _controller.GetBySlug(slug);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnProduct = Assert.IsType<Product>(okResult.Value);
        Assert.Equal(slug, returnProduct.Slug);
    }

    [Fact]
    public async Task GetBySlug_ReturnsNotFound_WhenProductDoesNotExist()
    {
        // Arrange
        var slug = "non-existent-product";
        _mockRepo.Setup(repo => repo.GetBySlugAsync(slug)).ReturnsAsync((Product?)null);

        // Act
        var result = await _controller.GetBySlug(slug);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }
}
