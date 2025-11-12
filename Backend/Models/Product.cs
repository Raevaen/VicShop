using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace VicShopAPI.Models;

public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public string Slug { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int PriceCents { get; set; }
    public List<string> Images { get; set; } = new();
    public int Stock { get; set; }
}
