using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mollie.Api.Client;
using Mollie.Api.Models;
using Mollie.Api.Models.Payment.Request;
using VicShopAPI.Models;
using VicShopAPI.Repositories;

namespace VicShopAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IOrderRepository _orderRepository;
    private readonly PaymentClient _paymentClient;
    private readonly IConfiguration _configuration;

    public PaymentsController(IOrderRepository orderRepository, PaymentClient paymentClient, IConfiguration configuration)
    {
        _orderRepository = orderRepository;
        _paymentClient = paymentClient;
        _configuration = configuration;
    }

    [HttpPost("create")]
    public async Task<ActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value 
                     ?? User.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }

        // Create order in database
        var order = new Order
        {
            UserId = userId,
            Items = request.Items,
            TotalAmountCents = request.TotalAmountCents,
            ShippingAddress = request.ShippingAddress,
            Status = "Pending",
            PaymentStatus = "pending"
        };

        await _orderRepository.CreateAsync(order);

        // Create Mollie payment
        var amount = new Amount("EUR", (request.TotalAmountCents / 100m).ToString("F2"));
        var redirectUrl = request.RedirectUrl ?? $"{_configuration["FrontendUrl"]}/checkout/success";
        var webhookUrl = $"{_configuration["BackendUrl"]}/api/payments/webhook";

        var paymentRequest = new PaymentRequest
        {
            Amount = amount,
            Description = $"Order {order.Id}",
            RedirectUrl = redirectUrl,
            WebhookUrl = webhookUrl,
            Metadata = order.Id
        };

        var payment = await _paymentClient.CreatePaymentAsync(paymentRequest);

        // Update order with payment ID
        order.MolliePaymentId = payment.Id;
        await _orderRepository.UpdateAsync(order.Id, order);

        return Ok(new { paymentUrl = payment.Links.Checkout.Href, orderId = order.Id });
    }

    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<ActionResult> Webhook([FromBody] WebhookRequest request)
    {
        if (string.IsNullOrEmpty(request.Id))
        {
            return BadRequest("Payment ID required");
        }

        var payment = await _paymentClient.GetPaymentAsync(request.Id);
        
        if (payment.Metadata == null)
        {
            return BadRequest("Order ID not found in payment metadata");
        }

        var order = await _orderRepository.GetByIdAsync(payment.Metadata);
        if (order == null)
        {
            return NotFound("Order not found");
        }

        // Update order based on payment status
        order.PaymentStatus = payment.Status;
        order.PaymentMethod = payment.Method;

        if (payment.Status == "paid")
        {
            order.Status = "Paid";
            order.PaidAt = payment.PaidAt;
        }
        else if (payment.Status == "failed" || payment.Status == "expired" || payment.Status == "canceled")
        {
            order.Status = "Failed";
        }

        await _orderRepository.UpdateAsync(order.Id, order);

        return Ok();
    }
}

public class CreatePaymentRequest
{
    public List<OrderItem> Items { get; set; } = new();
    public int TotalAmountCents { get; set; }
    public string? ShippingAddress { get; set; }
    public string? RedirectUrl { get; set; }
}

public class WebhookRequest
{
    public string Id { get; set; } = null!;
}
