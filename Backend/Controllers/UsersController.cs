using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VicShopAPI.Models;
using VicShopAPI.Repositories;

namespace VicShopAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserRepository userRepository, ILogger<UsersController> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncUser()
    {
        var oid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                  User.FindFirst("oid")?.Value;
                  
        var email = User.FindFirst("emails")?.Value ?? 
                    User.FindFirst(ClaimTypes.Email)?.Value ??
                    User.FindFirst("preferred_username")?.Value;

        if (string.IsNullOrEmpty(oid) || string.IsNullOrEmpty(email))
        {
            _logger.LogWarning("Sync failed: Missing oid or email claims.");
            return BadRequest("Could not extract user information from token.");
        }

        var user = new User
        {
            Id = oid,
            Email = email,
            LastLoginAt = DateTime.UtcNow
        };

        await _userRepository.UpsertUserAsync(user);
        
        return Ok(new { Message = "User synced successfully", User = user });
    }
}
