using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace VicShopAPI.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public string Id { get; set; } = null!; // Maps to Azure AD OID

    public string Email { get; set; } = null!;

    public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;
}
