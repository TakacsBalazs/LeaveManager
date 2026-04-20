using LeaveManagerAPI.Constants;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;

namespace LeaveManagerAPI.Controllers
{
    [Route("api/leavebalances")]
    [ApiController]
    public class LeaveBalanceController : ControllerBase
    {
        private ILeaveBalanceService leaveBalanceService;

        public LeaveBalanceController(ILeaveBalanceService leaveBalanceService)
        {
            this.leaveBalanceService = leaveBalanceService;
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpGet]
        public async Task<IActionResult> GetAllLeaveBalances([FromQuery] GetAllLeaveBalancesRequest request)
        {
            var result = await leaveBalanceService.GetAllLeaveBalancesAsync(request);
            if(!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Data);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        public async Task<IActionResult> CreateLeaveBalance([FromBody] CreateLeaveBalanceRequest request)
        {
            var result = await leaveBalanceService.CreateLeaveBalanceAsync(request);
            if(!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Data);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveBalance([FromBody] UpdateLeaveBalanceRequest request, int id)
        {
            var result = await leaveBalanceService.UpdateLeaveBalanceAsync(request, id);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Data);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveBalance(int id)
        {
            var result = await leaveBalanceService.DeleteLeaveBalanceAsync(id);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(new { message = "Successful delete the leave balance!" });
        }
    }
}
