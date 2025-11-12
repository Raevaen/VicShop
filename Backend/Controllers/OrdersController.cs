using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VicShopAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    [HttpPost]
    public IActionResult CreateOrder()
    {
        // Minimal implementation for creating an order
        return Ok(new { Message = "Order created successfully!" });
    }
}
