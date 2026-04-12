using LeaveManagerAPI.Common;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;

namespace LeaveManagerAPI.Services
{
    public interface IAuthService
    {
        Task<Result<LoginResponse>> LoginAsync(UserLoginRequest request);
    }
}
