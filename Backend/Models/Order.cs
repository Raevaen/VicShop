using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace VicShopAPI.Models;

public class Order
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public List<OrderItem> Items { get; set; } = new();

    public int TotalAmountCents { get; set; }

    public string Status { get; set; } = "Pending"; // Pending, Paid, Failed, Cancelled

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Simplified shipping address for now
    public string? ShippingAddress { get; set; }
    
    // Payment tracking (no card details stored)
    public string? MolliePaymentId { get; set; }
    public string? PaymentStatus { get; set; } // open, paid, failed, expired, canceled
    public string? PaymentMethod { get; set; } // ideal, creditcard, etc.
    public DateTime? PaidAt { get; set; }
}
