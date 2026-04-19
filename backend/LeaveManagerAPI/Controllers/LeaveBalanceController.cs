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
        private ILeaveService leaveService;

        public LeaveBalanceController(ILeaveService leaveService)
        {
            this.leaveService = leaveService;
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpGet]
        public async Task<IActionResult> GetAllLeaveBalances()
        {
            var result = await leaveService.GetAllLeaveBalancesAsync();
            if(!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Data);
        }
    }
}
