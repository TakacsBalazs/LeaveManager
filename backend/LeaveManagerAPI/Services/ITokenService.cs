using LeaveManagerAPI.Models;

namespace LeaveManagerAPI.Services
{
    public interface ITokenService
    {
        Task<string> GenerateJwtToken(User user);
    }
}
