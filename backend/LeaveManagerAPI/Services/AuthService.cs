using LeaveManagerAPI.Common;
using LeaveManagerAPI.Extensions;
using LeaveManagerAPI.Models;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;

namespace LeaveManagerAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly ITokenService tokenService;
        private readonly UserManager<User> userManager;
        private readonly IServiceProvider serviceProvider;

        public AuthService(ITokenService tokenService, UserManager<User> userManager, IServiceProvider serviceProvider)
        {
            this.tokenService = tokenService;
            this.userManager = userManager;
            this.serviceProvider = serviceProvider;

        }

        public async Task<Result<LoginResponse>> LoginAsync(UserLoginRequest request)
        {
            var validate = await serviceProvider.ValidateRequestAsync<UserLoginRequest>(request);
            if (!validate.IsSuccess)
            {
                return Result<LoginResponse>.Failure(validate.Errors);
            }

            User? user = await userManager.FindByEmailAsync(request.Email);
            if(user == null)
            {
                return Result<LoginResponse>.Failure("Invalid login");
            }

            var passwordCheck = await userManager.CheckPasswordAsync(user, request.Password);
            if (!passwordCheck)
            {
                return Result<LoginResponse>.Failure("Invalid login");
            }

            var accessToken = await tokenService.GenerateJwtToken(user);

            var response = new LoginResponse
            {
                AccessToken = accessToken
            };

            return Result<LoginResponse>.Success(response);

        }
    }
}
