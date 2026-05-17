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

        public NotificationService(AppDbContext context, IHubContext<LeaveHub)
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

        public async Task<Result<NotificationResponse>> GetNotificationByIdAsync(int id, string userId)
        {
            var notification = await context.Notifications.FindAsync(id);
            if(notification == null) {
                return Result<NotificationResponse>.Failure("Invalid Id!");
            }

            if(notification.UserId != userId)
            {
                return Result<NotificationResponse>.Failure("Can't see this notification!");
            }

            if (!notification.IsRead)
            {
                notification.IsRead = true;
                await context.SaveChangesAsync();
            }

            var response = new NotificationResponse
            {
                Id = notification.Id,
                Title = notification.Title,
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt,
            };

            return Result<NotificationResponse>.Success(response);
        }
    }
}
