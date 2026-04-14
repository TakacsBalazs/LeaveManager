using LeaveManagerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LeaveManagerAPI.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ILeaveService leaveService;
        public DashboardController(ILeaveService leaveService)
        {
            this.leaveService = leaveService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetDashboardAsync()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await leaveService.GetDashboardAsync(userId);

            if(!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result.Data);
        }
    }
}
