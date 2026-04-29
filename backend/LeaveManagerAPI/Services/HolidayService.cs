using LeaveManagerAPI.Common;
using LeaveManagerAPI.Data;
using LeaveManagerAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagerAPI.Services
{
    public class HolidayService : IHolidayService
    {
        private readonly AppDbContext context;

        public HolidayService(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Result<IEnumerable<HolidayResponse>>> GetAllHolidaysAsync()
        {
            var response = await context.Holidays.Select(x => new HolidayResponse
            {
                Id = x.Id,
                Name = x.Name,
                Date = x.Date
            }).ToListAsync();

            return Result<IEnumerable<HolidayResponse>>.Success(response);
        }
    }
}
