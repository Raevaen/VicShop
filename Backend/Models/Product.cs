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

    // Soccer Specific Attributes
    public string? Team { get; set; }
    public string? League { get; set; }
    public string? Season { get; set; }
    public string? Size { get; set; }
    public string? Condition { get; set; }
    public string? Brand { get; set; }
}
