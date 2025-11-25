using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Entities.Models;

namespace EdushareBackend.Helpers
{
    public class BanCheckAttribute : ActionFilterAttribute
    {
        public override async Task OnActionExecutionAsync(
            ActionExecutingContext context, 
            ActionExecutionDelegate next)
        {
            var path = context.HttpContext.Request.Path.Value?.ToLower();
            if (path != null && (path.Contains("/login") || path.Contains("/register") || path.Contains("/swagger")))
            {
                await next();
                return;
            }

            var userManager = context.HttpContext.RequestServices
                .GetRequiredService<UserManager<AppUser>>();
            
            var userId = context.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await userManager.FindByIdAsync(userId);
                
                if (user != null && user.IsBanned)
                {
                    context.Result = new ObjectResult(new 
                    { 
                        message = "Your account has been banned." 
                    })
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                    return;
                }
            }
            await next();
        }
    }
}
