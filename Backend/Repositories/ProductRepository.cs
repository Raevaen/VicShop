using MongoDB.Driver;
using VicShopAPI.Models;

namespace VicShopAPI.Repositories;

public class ProductRepository
{
    private readonly IMongoCollection<Product> _products;

    public ProductRepository(IConfiguration configuration)
    {
        var client = new MongoClient(configuration["MongoDB:ConnectionString"]);
        var database = client.GetDatabase(configuration["MongoDB:Database"]);
        _products = database.GetCollection<Product>("products");
    }

    public async Task<List<Product>> GetAllAsync() => await _products.Find(_ => true).ToListAsync();

    public async Task<Product?> GetBySlugAsync(string slug) =>
        await _products.Find(p => p.Slug == slug).FirstOrDefaultAsync();
}
