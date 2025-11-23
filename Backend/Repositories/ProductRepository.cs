using MongoDB.Driver;
using VicShopAPI.Models;

namespace VicShopAPI.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly IMongoCollection<Product> _products;

    public ProductRepository(IMongoDatabase database)
    {
        _products = database.GetCollection<Product>("products");
    }

    public async Task<List<Product>> GetAllAsync() => await _products.Find(_ => true).ToListAsync();

    public async Task<Product?> GetBySlugAsync(string slug) =>
        await _products.Find(p => p.Slug == slug).FirstOrDefaultAsync();
}
