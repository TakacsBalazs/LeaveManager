using LeaveManagerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LeaveManagerAPI.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService notificationService;

        public NotificationController(INotificationService notificationService)
        {
            this.notificationService = notificationService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserAllNotification()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await notificationService.GetUserAllNotificationAsync(userId);
            
            return Ok(result.Data);
        }
    }
}
