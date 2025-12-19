using VicShopAPI.Models;

namespace VicShopAPI.Repositories;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync(string? team = null, string? league = null);
    Task<Product?> GetBySlugAsync(string slug);
}
