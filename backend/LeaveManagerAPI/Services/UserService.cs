using LeaveManagerAPI.Common;
using LeaveManagerAPI.Data;
using LeaveManagerAPI.Extensions;
using LeaveManagerAPI.Models;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagerAPI.Services
{
    public class UserService : IUserService
    {
        private AppDbContext context;
        private IServiceProvider serviceProvider;
        private UserManager<User> userManager;
        public UserService(AppDbContext context, IServiceProvider serviceProvider, UserManager<User> userManager)
        {
            this.context = context;
            this.serviceProvider = serviceProvider;
            this.userManager = userManager;
        }


        public async Task<Result<UserResponse>> CreateUserAsync(CreateUserRequest request)
        {
            var validate = await serviceProvider.ValidateRequestAsync<CreateUserRequest>(request);
            if (!validate.IsSuccess) {
                return Result<UserResponse>.Failure(validate.Errors);
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                UserName = request.Email
            };

            var userResult = await userManager.CreateAsync(user, request.Password);
            if (!userResult.Succeeded) {
                var errors = userResult.Errors.Select(x => x.Description).ToList();
                return Result<UserResponse>.Failure(errors);
            }

            foreach (var role in request.Roles)
            {
                var roleResult = await userManager.AddToRoleAsync(user, role);
                if (!roleResult.Succeeded)
                {
                    await userManager.DeleteAsync(user);

                    var errors = roleResult.Errors.Select(x => x.Description).ToList();
                    return Result<UserResponse>.Failure(errors);
                }
            }
            var response = new UserResponse
            {
                Id = user.Id,
                Fullname = user.FullName,
                Email = user.Email,
                Roles = request.Roles
            };

            return Result<UserResponse>.Success(response);
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
