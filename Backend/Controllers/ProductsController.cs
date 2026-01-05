using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;
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

    [Authorize]
    [RequiredScope("products_admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> Create(Product product)
    {
        await _repository.CreateAsync(product);
        return CreatedAtAction(nameof(GetBySlug), new { slug = product.Slug }, product);
    }

    [Authorize]
    [RequiredScope("products_admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Product product)
    {
        if (id != product.Id) return BadRequest();
        
        await _repository.UpdateAsync(id, product);
        return NoContent();
    }

    [Authorize]
    [RequiredScope("products_admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}
