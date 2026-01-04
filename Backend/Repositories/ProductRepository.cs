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

    public async Task<List<Product>> GetAllAsync(string? team = null, string? league = null)
    {
        var filter = Builders<Product>.Filter.Empty;
        if (!string.IsNullOrEmpty(team))
        {
            filter &= Builders<Product>.Filter.Eq(p => p.Team, team);
        }
        if (!string.IsNullOrEmpty(league))
        {
            filter &= Builders<Product>.Filter.Eq(p => p.League, league);
        }

        return await _products.Find(filter).ToListAsync();
    }

    public async Task<Product?> GetBySlugAsync(string slug) =>
        await _products.Find(p => p.Slug == slug).FirstOrDefaultAsync();

    public async Task CreateAsync(Product product)
    {
        await _products.InsertOneAsync(product);
    }

    public async Task UpdateAsync(string id, Product product)
    {
        await _products.ReplaceOneAsync(p => p.Id == id, product);
    }

    public async Task DeleteAsync(string id)
    {
        await _products.DeleteOneAsync(p => p.Id == id);
    }
}
