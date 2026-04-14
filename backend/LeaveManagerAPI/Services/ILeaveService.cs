using LeaveManagerAPI.Common;
using LeaveManagerAPI.Models.Responses;

namespace LeaveManagerAPI.Services
{
    public interface ILeaveService
    {
        Task<Result<DashboardResponse>> GetDashboardAsync(string userId);
    }
}
