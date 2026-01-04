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
    [Fact]
    public async Task Create_ReturnsCreatedAtAction()
    {
        // Arrange
        var product = new Product { Id = "1", Title = "New Product", Slug = "new-product" };
        _mockRepo.Setup(repo => repo.CreateAsync(product)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Create(product);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal("GetBySlug", createdAtActionResult.ActionName);
        Assert.Equal(product.Slug, createdAtActionResult.RouteValues["slug"]);
        Assert.Equal(product, createdAtActionResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsNoContent_WhenIdMatches()
    {
        // Arrange
        var id = "1";
        var product = new Product { Id = id, Title = "Updated Product" };
        _mockRepo.Setup(repo => repo.UpdateAsync(id, product)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Update(id, product);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        // Arrange
        var id = "1";
        var product = new Product { Id = "2", Title = "Updated Product" };

        // Act
        var result = await _controller.Update(id, product);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent()
    {
        // Arrange
        var id = "1";
        _mockRepo.Setup(repo => repo.DeleteAsync(id)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Delete(id);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Theory]
    [InlineData(nameof(ProductsController.Create))]
    [InlineData(nameof(ProductsController.Update))]
    [InlineData(nameof(ProductsController.Delete))]
    public void Endpoints_Have_Authorize_And_RequiredScope_Attributes(string methodName)
    {
        // Arrange
        var method = typeof(ProductsController).GetMethod(methodName);

        // Act
        var authorizeAttribute = method.GetCustomAttributes(typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute), false).FirstOrDefault();
        var requiredScopeAttribute = method.GetCustomAttributes(typeof(Microsoft.Identity.Web.Resource.RequiredScopeAttribute), false).FirstOrDefault() as Microsoft.Identity.Web.Resource.RequiredScopeAttribute;

        // Assert
        Assert.NotNull(authorizeAttribute);
        Assert.NotNull(requiredScopeAttribute);
        var scopes = requiredScopeAttribute.AcceptedScope;
        Assert.Contains("products.admin", scopes);
    }
}
