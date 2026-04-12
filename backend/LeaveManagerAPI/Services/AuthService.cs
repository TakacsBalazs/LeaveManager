using LeaveManagerAPI.Common;
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

        public AuthService(ITokenService tokenService, UserManager<User> userManager)
        {
            this.tokenService = tokenService;
            this.userManager = userManager;
        }

        public async Task<Result<LoginResponse>> LoginAsync(UserLoginRequest request)
        {
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
