using LeaveManagerAPI.Common;
using LeaveManagerAPI.Models.Responses;

namespace LeaveManagerAPI.Services
{
    public interface INotificationService
    {

        Task<Result<IEnumerable<NotificationResponse>>> GetUserAllNotificationAsync(string userId);
    }
}
