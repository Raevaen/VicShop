using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace VicShopAPI.Security;

public class AdminRequirementHandler : AuthorizationHandler<AdminRequirement>
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AdminRequirementHandler> _logger;

    public AdminRequirementHandler(IConfiguration configuration, ILogger<AdminRequirementHandler> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AdminRequirement requirement)
    {
        var userEmail = context.User.FindFirst(ClaimTypes.Upn)?.Value ?? 
                        context.User.FindFirst(ClaimTypes.Email)?.Value ??
                        context.User.FindFirst("preferred_username")?.Value;

        if (string.IsNullOrEmpty(userEmail))
        {
            _logger.LogWarning("Admin check failed: User email not found in claims.");
            return Task.CompletedTask;
        }

        var whitelist = _configuration["AdminWhitelist"]?.Split(',', StringSplitOptions.RemoveEmptyEntries) 
                        ?? Array.Empty<string>();

        if (whitelist.Any(email => email.Trim().Equals(userEmail, StringComparison.OrdinalIgnoreCase)))
        {
            context.Succeed(requirement);
        }
        else
        {
            _logger.LogWarning("Admin check failed: User {UserEmail} is not in the whitelist.", userEmail);
        }

        return Task.CompletedTask;
    }
}
