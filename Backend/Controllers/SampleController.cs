using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VicShopAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SampleController : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = "AccessAsUser")]
    public IActionResult GetSecureData()
    {
        return Ok(new { Message = "This is a secure endpoint!" });
    }
}
