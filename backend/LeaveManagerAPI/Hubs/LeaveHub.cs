using LeaveManagerAPI.Constants;
using Microsoft.AspNetCore.SignalR;

namespace LeaveManagerAPI.Hubs
{
    public class LeaveHub : Hub<ILeaveClient>
    {
        public override async Task OnConnectedAsync()
        {
            if (Context.User.IsInRole(UserRoles.Admin))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, UserRoles.Admin);
            }

            await base.OnConnectedAsync();
        }
    }
}
