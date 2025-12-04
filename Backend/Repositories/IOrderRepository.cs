using VicShopAPI.Models;

namespace VicShopAPI.Repositories;

public interface IOrderRepository
{
    Task CreateAsync(Order order);
    Task<List<Order>> GetByUserIdAsync(string userId);
}
