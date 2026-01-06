using MongoDB.Driver;
using VicShopAPI.Models;

namespace VicShopAPI.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("users");
    }

    public async Task UpsertUserAsync(User user)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, user.Id);
        var update = Builders<User>.Update
            .Set(u => u.Email, user.Email)
            .Set(u => u.LastLoginAt, user.LastLoginAt);
            
        await _users.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
    }
}
