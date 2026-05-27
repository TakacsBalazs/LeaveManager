using LeaveManagerAPI.Common;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;

namespace LeaveManagerAPI.Services
{
    public interface IUserService
    {
        Task<Result<IEnumerable<UserResponse>>> GetUsersAsync(GetUsersRequest request);

        Task<Result<UserResponse>> CreateUserAsync(CreateUserRequest request);

        Task<Result<UserResponse>> UpdateUserAsync(UpdateUserRequest request, string userId);

        Task<Result> DeleteUserAsync(string userId);

        Task<Result<IEnumerable<UserDropdownResponse>>> GetUsersDropdownsAsync();

        Task<Result<IEnumerable<RoleResponse>>> GetRolesAsync();

        Task<Result> UploadProfilePictureAsync(UploadProfilePictureRequest request, string userId);
    }
}
