using VicShopAPI.Models;

namespace VicShopAPI.Repositories;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync(string? team = null, string? league = null);
    Task<Product?> GetBySlugAsync(string slug);
    Task CreateAsync(Product product);
    Task UpdateAsync(string id, Product product);
    Task DeleteAsync(string id);
}
