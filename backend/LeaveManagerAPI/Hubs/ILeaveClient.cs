using LeaveManagerAPI.Models.Responses;

namespace LeaveManagerAPI.Hubs
{
    public interface ILeaveClient
    {
        Task ReceiveNotification(NotificationResponse notification);
    }
}
