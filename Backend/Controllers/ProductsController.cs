using Microsoft.AspNetCore.Mvc;
using VicShopAPI.Models;
using VicShopAPI.Repositories;

namespace VicShopAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repository;

    public ProductsController(IProductRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAll([FromQuery] string? team, [FromQuery] string? league)
    {
        var products = await _repository.GetAllAsync(team, league);
        return Ok(products);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Product>> GetBySlug(string slug)
    {
        var product = await _repository.GetBySlugAsync(slug);
        if (product == null) return NotFound();
        return Ok(product);
    }
}
