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
        private readonly ILeaveRequestService leaveRequestService;

        public LeaveRequestController(ILeaveRequestService leaveRequestService)
        {
            this.leaveRequestService = leaveRequestService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateLeaveReuqest([FromBody] CreateLeaveRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await leaveRequestService.CreateLeaveRequestAsnyc(request, userId);
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
            var result = await leaveRequestService.GetMyRequestsAsync(userId);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Data);
        }

        [Authorize]
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelRequest(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await leaveRequestService.CancelRequestAsync(id, userId);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(new { message = "Successful cancel the leave request!" });
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRequestById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            bool hasPrivileges = User.IsInRole(UserRoles.Admin);
            var result = await leaveRequestService.GetRequestByIdAsync(id, userId, hasPrivileges);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Data);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveRequest(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await leaveRequestService.ApproveRequestAsync(id, userId);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);

            }
            return Ok(new { message = "Successful approve the leave request!" });
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectRequest(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await leaveRequestService.RejectRequestAsync(id, userId);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);

            }
            return Ok(new { message = "Successful reject the leave request!" });
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpGet("allpendingrequests")]
        public async Task<IActionResult> GetAllPendingRequests()
        {
            var result = await leaveRequestService.GetAllPendingRequestsAsync();
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);

            }
            return Ok(result.Data);
        }
    }
}
