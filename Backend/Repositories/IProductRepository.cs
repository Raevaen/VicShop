using VicShopAPI.Models;

namespace VicShopAPI.Repositories;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();
    Task<Product?> GetBySlugAsync(string slug);
}
