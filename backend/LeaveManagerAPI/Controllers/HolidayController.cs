using LeaveManagerAPI.Constants;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagerAPI.Controllers
{
    [Route("api/holidays")]
    [ApiController]
    public class HolidayController : ControllerBase
    {
        private readonly IHolidayService holidayService;

        public HolidayController(IHolidayService holidayService)
        {
            this.holidayService = holidayService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllHolidays([FromQuery] GetHolidaysRequest request)
        {
            var result = await holidayService.GetAllHolidaysAsync(request);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result.Data);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        public async Task<IActionResult> CreateHoliday([FromBody] CreateHolidayRequest request)
        {
            var result = await holidayService.CreateHolidayAsync(request);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Data);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoliday(int id)
        {
            var result = await holidayService.DeleteHolidayAsync(id);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "Successful delete the holiday!" });
        }
    }
}
