using VicShopAPI.Models;

namespace VicShopAPI.Repositories;

public interface IOrderRepository
{
    Task CreateAsync(Order order);
    Task<List<Order>> GetByUserIdAsync(string userId);
    Task<Order?> GetByIdAsync(string id);
    Task UpdateAsync(string id, Order order);
}
