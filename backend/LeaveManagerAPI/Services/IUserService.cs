using LeaveManagerAPI.Common;
using LeaveManagerAPI.Models.Responses;

namespace LeaveManagerAPI.Services
{
    public interface IUserService
    {
        Task<Result<IEnumerable<UserResponse>>> GetUsersAsync();
    }
}
