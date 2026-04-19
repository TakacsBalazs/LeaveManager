using LeaveManagerAPI.Common;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;

namespace LeaveManagerAPI.Services
{
    public interface ILeaveService
    {
        Task<Result<DashboardResponse>> GetDashboardAsync(string userId);

        Task<Result> CreateLeaveRequestAsnyc(CreateLeaveRequest request, string userId);

        Task<Result<IEnumerable<LeaveRequestResponse>>> GetMyRequestsAsync(string userId);

        Task<Result> CancelRequestAsync(int id, string userId);

        Task<Result<LeaveRequestResponse>> GetRequestByIdAsync(int id, string userId, bool hasPrivileges);

        Task<Result> ApproveRequestAsync(int id, string userId);

        Task<Result> RejectRequestAsync(int id, string userId);

        Task<Result<IEnumerable<LeaveRequestResponse>>> GetAllPendingRequestsAsync();

        Task<Result<IEnumerable<LeaveBalanceResponse>>> GetAllLeaveBalancesAsync();

        Task<Result<LeaveBalanceResponse>> CreateLeaveBalanceAsync(CreateLeaveBalanceRequest request);
        
        Task<Result<LeaveBalanceResponse>> UpdateLeaveBalanceAsync(UpdateLeaveBalanceRequest request, int id);

        Task<Result> DeleteLeaveBalanceAsync(int id);
    }
}
