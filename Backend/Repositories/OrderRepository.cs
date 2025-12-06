using MongoDB.Driver;
using VicShopAPI.Models;

namespace VicShopAPI.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly IMongoCollection<Order> _orders;

    public OrderRepository(IMongoDatabase database)
    {
        _orders = database.GetCollection<Order>("orders");
    }

    public async Task CreateAsync(Order order)
    {
        await _orders.InsertOneAsync(order);
    }

    public async Task<List<Order>> GetByUserIdAsync(string userId)
    {
        return await _orders.Find(o => o.UserId == userId).SortByDescending(o => o.CreatedAt).ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(string id)
    {
        return await _orders.Find(o => o.Id == id).FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(string id, Order order)
    {
        await _orders.ReplaceOneAsync(o => o.Id == id, order);
    }
}
