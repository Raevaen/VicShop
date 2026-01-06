using VicShopAPI.Models;

namespace VicShopAPI.Repositories;

public interface IUserRepository
{
    Task UpsertUserAsync(User user);
    Task<User?> GetByIdAsync(string id);
}
