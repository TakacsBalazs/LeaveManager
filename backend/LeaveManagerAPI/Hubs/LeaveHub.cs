using LeaveManagerAPI.Constants;
using Microsoft.AspNetCore.SignalR;

namespace LeaveManagerAPI.Hubs
{
    public class LeaveHub : Hub<ILeaveClient>
    {
    }
}
