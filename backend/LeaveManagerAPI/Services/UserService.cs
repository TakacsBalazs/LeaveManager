using LeaveManagerAPI.Common;
using LeaveManagerAPI.Data;
using LeaveManagerAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagerAPI.Services
{
    public class UserService : IUserService
    {
        private AppDbContext context;
        public UserService(AppDbContext context)
        {
            this.context = context;

        }

        public async Task<Result<IEnumerable<UserResponse>>> GetUsersAsync()
        {
            var response = await context.Users.Select(user => new UserResponse
            {
                Id = user.Id,
                Fullname = user.FullName,
                Email = user.Email!,
                Roles = context.Roles.Where(r => context.UserRoles.Any(ur => ur.RoleId == r.Id && ur.UserId == user.Id)).Select(x => x.Name).ToList()!

            }).ToListAsync();

            return Result<IEnumerable<UserResponse>>.Success(response);
        }
    }
}
