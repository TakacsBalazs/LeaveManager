using LeaveManagerAPI.Common;
using LeaveManagerAPI.Data;
using LeaveManagerAPI.Hubs;
using LeaveManagerAPI.Models.Responses;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagerAPI.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext context;

        public NotificationService(AppDbContext context, IHubContext<LeaveHub, ILeaveClient> hubContext)
        {
            this.context = context;
        }

        public async Task<Result<IEnumerable<NotificationResponse>>> GetUserAllNotificationAsync(string userId)
        {
            var response = await context.Notifications.Where(x => x.UserId == userId).OrderByDescending(x => x.CreatedAt)
                .Select(x => new NotificationResponse
                {
                    Id = x.Id,
                    Title = x.Title,
                    Message = x.Message,
                    IsRead = x.IsRead,
                    CreatedAt = x.CreatedAt
                }).ToListAsync();

            return Result<IEnumerable<NotificationResponse>>.Success(response);
        }
    }
}
