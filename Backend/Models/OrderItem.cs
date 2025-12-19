namespace VicShopAPI.Models;

public class OrderItem
{
    public string ProductId { get; set; } = null!;
    public string Title { get; set; } = null!;
    public int Quantity { get; set; }
    public int PriceCents { get; set; }
}
