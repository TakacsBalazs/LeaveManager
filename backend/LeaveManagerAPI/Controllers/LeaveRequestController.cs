using Azure.Core;
using LeaveManagerAPI.Constants;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LeaveManagerAPI.Controllers
{
    [Route("api/leaverequests")]
    [ApiController]
    public class LeaveRequestController : ControllerBase
    {
        private readonly ILeaveService leaveService;

        public LeaveRequestController(ILeaveService leaveService)
        {
            this.leaveService = leaveService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateLeaveReuqest([FromBody] CreateLeaveRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await leaveService.CreateLeaveRequestAsnyc(request, userId);
            if(!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(new {message = "Successful create a leave request!" });
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyRequests()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await leaveService.GetMyRequestsAsync(userId);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Data);
        }
    }
}
