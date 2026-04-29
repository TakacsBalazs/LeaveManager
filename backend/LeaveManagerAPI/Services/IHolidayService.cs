using LeaveManagerAPI.Common;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;

namespace LeaveManagerAPI.Services
{
    public interface IHolidayService
    {
        Task<Result<IEnumerable<HolidayResponse>>> GetAllHolidaysAsync();
    }
}
