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
        private readonly IAzureBlobService azureBlobService;
        public UserService(AppDbContext context, IServiceProvider serviceProvider, UserManager<User> userManager, IAzureBlobService azureBlobService)
        {
            this.context = context;
            this.serviceProvider = serviceProvider;
            this.userManager = userManager;
            this.azureBlobService = azureBlobService;

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

        public async Task<Result<IEnumerable<UserResponse>>> GetUsersAsync(GetUsersRequest request)
        {
            var users = context.Users.AsQueryable();
            if (!string.IsNullOrEmpty(request.Fullname))
            {
                users = users.Where(x => x.FullName.Contains(request.Fullname));
            }

            if (!string.IsNullOrEmpty(request.Email))
            {
                users = users.Where(x => x.Email!.Contains(request.Email));
            }

            if(request.Roles != null && request.Roles.Any())
            {
                var hasRoles = context.UserRoles.Where(x => request.Roles.Contains(x.RoleId)).Select(x => x.UserId);
                users = users.Where(x => hasRoles.Contains(x.Id));
            }

            var response = await users.Select(user => new UserResponse
            {
                Id = user.Id,
                Fullname = user.FullName,
                Email = user.Email!,
                Roles = context.Roles.Where(r => context.UserRoles.Any(ur => ur.RoleId == r.Id && ur.UserId == user.Id)).Select(x => x.Name).ToList()!

            }).ToListAsync();

            return Result<IEnumerable<UserResponse>>.Success(response);
        }

        public async Task<Result<UserResponse>> UpdateUserAsync(UpdateUserRequest request, string userId)
        {
            context.ChangeTracker.Clear();
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Result<UserResponse>.Failure("Invalid Id!");
            }

            user.FullName = request.Fullname;
            user.Email = request.Email;
            user.UserName = request.Email;
            var updateResult = await userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                var errors = updateResult.Errors.Select(x => x.Description).ToList();
                return Result<UserResponse>.Failure(errors);
            }

            var currentRoles = await userManager.GetRolesAsync(user);
            var removeRoles = await userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeRoles.Succeeded)
            {
                var errors = removeRoles.Errors.Select(x => x.Description).ToList();
                return Result<UserResponse>.Failure(errors);
            }

            var addRoles = await userManager.AddToRolesAsync(user, request.Roles);
            if (!addRoles.Succeeded)
            {
                var errors = addRoles.Errors.Select(x => x.Description).ToList();
                return Result<UserResponse>.Failure(errors);
            }

            var response = new UserResponse
            {
                Id = user.Id,
                Fullname = request.Fullname,
                Email = request.Email,
                Roles = request.Roles
            };

            return Result<UserResponse>.Success(response);
        }

        public async Task<Result> DeleteUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if(user == null)
            {
                return Result.Failure("Invalid Id!");
            }

            var result = await userManager.DeleteAsync(user);
            if(!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return Result.Failure(errors);
            }

            return Result.Success();
        }

        public async Task<Result<IEnumerable<UserDropdownResponse>>> GetUsersDropdownsAsync()
        {
            var response = await context.Users.OrderBy(x => x.FullName).Select(x => new UserDropdownResponse
            {
                Id = x.Id,
                Fullname = x.FullName
            }).ToListAsync();
            return Result<IEnumerable<UserDropdownResponse>>.Success(response);
        }

        public async Task<Result<IEnumerable<RoleResponse>>> GetRolesAsync()
        {
            var response = await context.Roles.Select(x => new RoleResponse
            {
                Id = x.Id,
                Name = x.Name!
            }).ToListAsync();

            return Result<IEnumerable<RoleResponse>>.Success(response);
        }

        public async Task<Result> UploadProfilePictureAsync(UploadProfilePictureRequest request, string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Result.Failure("Invalid Id!");
            }

            var allowedTypes = new List<string>() { "image/jpeg", "image/png"};
            if (!allowedTypes.Contains(request.File.ContentType)) 
            {
                return Result.Failure("Only a JPG or PNG file is allowed!");
            }

            if (request.File.Length > 2 * 1024 * 1024)
            {
                return Result.Failure("The file is more than 2 MB!");
            }

            if (user.ProfilePictureUrl != null)
            {
                await azureBlobService.DeleteFileAsync("profiles", user.ProfilePictureUrl);
            }
            
            using var stream = request.File.OpenReadStream();

            var profilePath = await azureBlobService.UploadAsync(stream, request.File.FileName, "profiles", request.File.ContentType);

            user.ProfilePictureUrl = profilePath.Data;

            var updateResult = await userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return Result.Failure(updateResult.Errors.Select(e => e.Description).ToList());
            }

            return Result.Success();
        }
    }
}
