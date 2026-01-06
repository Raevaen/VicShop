using Microsoft.AspNetCore.Authorization;

namespace VicShopAPI.Security;

public class AdminRequirement : IAuthorizationRequirement
{
    public AdminRequirement()
    {
    }
}
