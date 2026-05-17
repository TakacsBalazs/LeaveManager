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

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await notificationService.GetNotificationByIdAsync(id, userId);
            if(!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Data);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await notificationService.DeleteNotificationAsync(id, userId);
            if(!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(new { message = "Successful delete this notification!" });
        }
    }
}
