using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using VicShopAPI.Models;
using VicShopAPI.Repositories;
using System.Security.Claims;

namespace VicShopAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderRepository _orderRepository;

    public OrdersController(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] Order order)
    {
        // Get user ID from claims
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token.");
        }

        order.UserId = userId;
        order.CreatedAt = DateTime.UtcNow;
        order.Status = "Pending";

        // In a real app, we would validate prices here by fetching products from DB
        // For this demo, we'll trust the client (NOT RECOMMENDED FOR PRODUCTION)
        
        await _orderRepository.CreateAsync(order);

        return CreatedAtAction(nameof(GetMyOrders), new { id = order.Id }, order);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token.");
        }

        var orders = await _orderRepository.GetByUserIdAsync(userId);
        return Ok(orders);
    }
}
