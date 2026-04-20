using LeaveManagerAPI.Common;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;

namespace LeaveManagerAPI.Services
{
    public interface ILeaveBalanceService
    {
        Task<Result<IEnumerable<LeaveBalanceResponse>>> GetAllLeaveBalancesAsync();

        Task<Result<LeaveBalanceResponse>> CreateLeaveBalanceAsync(CreateLeaveBalanceRequest request);

        Task<Result<LeaveBalanceResponse>> UpdateLeaveBalanceAsync(UpdateLeaveBalanceRequest request, int id);

        Task<Result> DeleteLeaveBalanceAsync(int id);
    }
}
