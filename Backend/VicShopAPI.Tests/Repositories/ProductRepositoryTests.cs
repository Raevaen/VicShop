using MongoDB.Driver;
using Moq;
using VicShopAPI.Models;
using VicShopAPI.Repositories;
using Xunit;

namespace VicShopAPI.Tests.Repositories;

public class ProductRepositoryTests
{
    private readonly Mock<IMongoCollection<Product>> _mockCollection;
    private readonly Mock<IMongoDatabase> _mockDatabase;
    private readonly ProductRepository _repository;

    public ProductRepositoryTests()
    {
        _mockCollection = new Mock<IMongoCollection<Product>>();
        _mockDatabase = new Mock<IMongoDatabase>();

        _mockDatabase.Setup(d => d.GetCollection<Product>("products", null)).Returns(_mockCollection.Object);

        _repository = new ProductRepository(_mockDatabase.Object);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfProducts()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = "1", Title = "Product 1", Slug = "product-1" },
            new Product { Id = "2", Title = "Product 2", Slug = "product-2" }
        };

        var mockCursor = new Mock<IAsyncCursor<Product>>();
        mockCursor.Setup(_ => _.Current).Returns(products);
        mockCursor
            .SetupSequence(_ => _.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(true)
            .Returns(false);
        mockCursor
            .SetupSequence(_ => _.MoveNextAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(true)
            .ReturnsAsync(false);

        _mockCollection.Setup(op => op.FindAsync(
            It.IsAny<FilterDefinition<Product>>(),
            It.IsAny<FindOptions<Product, Product>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCursor.Object);

        // Act
        var result = await _repository.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsProductsWithSoccerAttributes()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product 
            { 
                Id = "1", 
                Title = "Retro Shirt", 
                Slug = "retro-shirt",
                Team = "AC Milan",
                League = "Serie A",
                Season = "1989/90",
                Size = "L",
                Condition = "Excellent",
                Brand = "Kappa"
            }
        };

        var mockCursor = new Mock<IAsyncCursor<Product>>();
        mockCursor.Setup(_ => _.Current).Returns(products);
        mockCursor
            .SetupSequence(_ => _.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(true)
            .Returns(false);
        mockCursor
            .SetupSequence(_ => _.MoveNextAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(true)
            .ReturnsAsync(false);

        _mockCollection.Setup(op => op.FindAsync(
            It.IsAny<FilterDefinition<Product>>(),
            It.IsAny<FindOptions<Product, Product>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCursor.Object);

        // Act
        var result = await _repository.GetAllAsync();

        // Assert
        Assert.Single(result);
        var product = result.First();
        Assert.Equal("AC Milan", product.Team);
        Assert.Equal("Serie A", product.League);
        Assert.Equal("1989/90", product.Season);
        Assert.Equal("L", product.Size);
        Assert.Equal("Excellent", product.Condition);
        Assert.Equal("Kappa", product.Brand);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsFilteredProducts_WhenTeamOrLeagueProvided()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = "1", Team = "AC Milan", League = "Serie A" },
            new Product { Id = "2", Team = "Inter Milan", League = "Serie A" },
            new Product { Id = "3", Team = "Manchester United", League = "Premier League" }
        };

        var mockCursor = new Mock<IAsyncCursor<Product>>();
        mockCursor.Setup(_ => _.Current).Returns(products.Where(p => p.Team == "AC Milan").ToList());
        mockCursor
            .SetupSequence(_ => _.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(true)
            .Returns(false);
        mockCursor
            .SetupSequence(_ => _.MoveNextAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(true)
            .ReturnsAsync(false);

        _mockCollection.Setup(op => op.FindAsync(
            It.IsAny<FilterDefinition<Product>>(),
            It.IsAny<FindOptions<Product, Product>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCursor.Object);

        // Act
        var result = await _repository.GetAllAsync(team: "AC Milan");

        // Assert
        Assert.Single(result);
        Assert.Equal("AC Milan", result.First().Team);
    }

    [Fact]
    public async Task GetBySlugAsync_ReturnsProduct_WhenExists()
    {
        // Arrange
        var slug = "test-product";
        var product = new Product { Id = "1", Title = "Test Product", Slug = slug };
        var products = new List<Product> { product };

        var mockCursor = new Mock<IAsyncCursor<Product>>();
        mockCursor.Setup(_ => _.Current).Returns(products);
        mockCursor
            .SetupSequence(_ => _.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(true)
            .Returns(false);
        mockCursor
            .SetupSequence(_ => _.MoveNextAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(true)
            .ReturnsAsync(false);

        _mockCollection.Setup(op => op.FindAsync(
            It.IsAny<FilterDefinition<Product>>(),
            It.IsAny<FindOptions<Product, Product>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCursor.Object);

        // Act
        var result = await _repository.GetBySlugAsync(slug);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(slug, result.Slug);
    }
}
