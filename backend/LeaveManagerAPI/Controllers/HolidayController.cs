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
        public async Task<IActionResult> GetAllHolidays()
        {
            var result = await holidayService.GetAllHolidaysAsync();
            if (!result.IsSuccess)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result.Data);
        }
    }
}
