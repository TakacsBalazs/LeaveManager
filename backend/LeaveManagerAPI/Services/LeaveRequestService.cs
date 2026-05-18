using LeaveManagerAPI.Common;
using LeaveManagerAPI.Constants;
using LeaveManagerAPI.Data;
using LeaveManagerAPI.Extensions;
using LeaveManagerAPI.Models;
using LeaveManagerAPI.Models.Dtos;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagerAPI.Services
{
    public class LeaveRequestService : ILeaveRequestService
    {
        private readonly AppDbContext context;
        private readonly IServiceProvider serviceProvider;
        private readonly INotificationService notificationService;

        public LeaveRequestService(AppDbContext context, IServiceProvider serviceProvider, INotificationService notificationService)
        {
            this.context = context;
            this.serviceProvider = serviceProvider;
            this.notificationService = notificationService;

        }
        public async Task<Result<DashboardResponse>> GetDashboardAsync(string userId)
        {
            var currentLeaveBalances = await context.LeaveBalances.Where(x => x.UserId == userId && x.Year == DateTime.UtcNow.Year)
            .Select(x => new LeaveBalanceDto
            {
                TotalDays = x.TotalDays,
                UsedDays = x.UsedDays,
                Year = x.Year,
                Type = x.Type,
                RemainingDays = x.RemainingDays
            }).ToListAsync();

            var response = new DashboardResponse
            {
                Balances = currentLeaveBalances
            };

            return Result<DashboardResponse>.Success(response);
        }

        public async Task<Result> CreateLeaveRequestAsnyc(CreateLeaveRequest request, string userId)
        {
            var validate = await serviceProvider.ValidateRequestAsync<CreateLeaveRequest>(request);
            if(!validate.IsSuccess)
            {
                return Result.Failure(validate.Errors);
            }

            var balance = await context.LeaveBalances.FirstOrDefaultAsync(x => x.Type == request.Type && x.Year == DateTime.UtcNow.Year && x.UserId == userId);
            if(balance == null)
            {
                return Result.Failure("Invalid leave request!");
            }

            var hasOverlap = await context.LeaveRequests.AnyAsync(x => x.UserId == userId && x.Status != LeaveRequestStatus.Rejected
                && x.Status != LeaveRequestStatus.Cancelled && request.StartDate <= x.EndDate && request.EndDate >= x.StartDate);

            if (hasOverlap)
            {
                return Result.Failure("You already have a leave request for this period!");
            }

            DateOnly current = request.StartDate;

            int workingDays = 0;

            var holidays = await context.Holidays.Where(x => request.StartDate <= x.Date && request.EndDate >= x.Date).Select(x => x.Date).ToListAsync();

            while (current <= request.EndDate)
            {
                if (current.DayOfWeek != DayOfWeek.Saturday && current.DayOfWeek != DayOfWeek.Sunday)
                {
                    if(!holidays.Contains(current))
                    {
                        workingDays++;
                    }
                }
                current = current.AddDays(1);
            }

            if(workingDays == 0) {
                return Result.Failure("This does not contain any working days.");
            }

            if(workingDays > balance.RemainingDays) {
                return Result.Failure("Don't have enough leave days!");
            }

            var leaveRequest = new LeaveRequest
            {
                UserId = userId,
                Type = request.Type,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Reason = request.Reason?.Trim(),
                RequestedDays = workingDays,
                Status = LeaveRequestStatus.Pending,
                ReviewerId = null,
                ReviewedAt = null
            };
            context.LeaveRequests.Add(leaveRequest);

            await context.SaveChangesAsync();

            var fullName = await context.Users.Where(x => x.Id == userId).Select(x => x.FullName).FirstOrDefaultAsync();

            await notificationService.SendNotificationToAdminsAsync("New Leave Request", $"A new {leaveRequest.Type} leave request has been submitted for the period: {leaveRequest.StartDate:yyyy-MM-dd} to {leaveRequest.EndDate:yyyy-MM-dd} by {fullName}.");

            return Result.Success();
        }

        public async Task<Result<IEnumerable<LeaveRequestResponse>>> GetMyRequestsAsync(string userId)
        {
            var requests = await context.LeaveRequests.Where(x => x.UserId == userId && x.StartDate.Year == DateTime.UtcNow.Year)
                .OrderByDescending(x => x.CreatedAt).Select(x => new LeaveRequestResponse
                {
                    Id = x.Id,
                    Type = x.Type,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    RequestedDays = x.RequestedDays,
                    Reason = x.Reason,
                    Status = x.Status,
                    ReviewerName = x.Reviewer != null ? x.Reviewer.FullName : null,
                    ReviewedAt = x.ReviewedAt,
                    CreatedAt = x.CreatedAt,
                    RequesterName = x.User.FullName

                }).ToListAsync();

            return Result<IEnumerable<LeaveRequestResponse>>.Success(requests);
        }

        public async Task<Result> CancelRequestAsync(int id, string userId)
        {
            var request = await context.LeaveRequests.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == id);
            if(request == null)
            {
                return Result.Failure("Invalid Id!");
            }

            if(request.UserId != userId)
            {
                return Result.Failure("Not your request!");
            }

            if(request.Status != LeaveRequestStatus.Pending)
            {
                return Result.Failure("Can't cancel this request!");
            }

            request.Status = LeaveRequestStatus.Cancelled;
            await context.SaveChangesAsync();

            await notificationService.SendNotificationToAdminsAsync("Leave Request Cancelled", $"The {request.Type} leave request for the period {request.StartDate:yyyy-MM-dd} to {request.EndDate:yyyy-MM-dd} has been cancelled by {request.User.FullName}.");

            return Result.Success();
        }

        public async Task<Result<LeaveRequestResponse>> GetRequestByIdAsync(int id, string userId, bool hasPrivileges)
        {
            var query = context.LeaveRequests.Where(x => x.Id == id);

            if (!hasPrivileges)
            {
                query = query.Where(x => x.UserId == userId);
            }

            var request = await query.Select(x => new LeaveRequestResponse
            {
                Id = x.Id,
                Type = x.Type,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                RequestedDays = x.RequestedDays,
                Reason = x.Reason,
                Status = x.Status,
                ReviewerName = x.Reviewer != null ? x.Reviewer.FullName : null,
                ReviewedAt = x.ReviewedAt,
                CreatedAt = x.CreatedAt,
                RequesterName = x.User.FullName
            }).FirstOrDefaultAsync();

            if(request == null)
            {
                return Result<LeaveRequestResponse>.Failure("Invalid Id or you don't have access to it!");
            }

            return Result<LeaveRequestResponse>.Success(request);
        }

        public async Task<Result> ApproveRequestAsync(int id, string userId)
        {
            var request = await context.LeaveRequests.FindAsync(id);
            if(request == null)
            {
                return Result.Failure("Invalid Id!");
            }

            if(request.Status != LeaveRequestStatus.Pending)
            {
                return Result.Failure("Status is not pending!");
            }

            var balance = await context.LeaveBalances.FirstOrDefaultAsync(x => x.Type == request.Type && x.Year == request.StartDate.Year && x.UserId == request.UserId);
            if(balance == null)
            {
                return Result.Failure("There is no balance of the type!");
            }

            if(balance.RemainingDays < request.RequestedDays)
            {
                return Result.Failure("User has not enough days left!");
            }

            balance.UsedDays += request.RequestedDays;

            request.Status = LeaveRequestStatus.Approved;
            request.ReviewerId = userId;
            request.ReviewedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();

            await notificationService.SendNotificationAsync(request.UserId, "Leave Request Approved", $"Your {request.Type} leave request for {request.StartDate:yyyy-MM-dd} to {request.EndDate:yyyy-MM-dd} has been approved.");

            return Result.Success();
        }

        public async Task<Result> RejectRequestAsync(int id, string userId)
        {
            var request = await context.LeaveRequests.FindAsync(id);
            if(request == null)
            {
                return Result.Failure("Invalid Id!");
            }

            if(request.Status != LeaveRequestStatus.Pending)
            {
                return Result.Failure("Status is not pending!");
            }

            request.Status = LeaveRequestStatus.Rejected;
            request.ReviewerId = userId;
            request.ReviewedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();

            await notificationService.SendNotificationAsync(request.UserId, "Leave Request Rejected", $"Your {request.Type} leave request for {request.StartDate:yyyy-MM-dd} to {request.EndDate:yyyy-MM-dd} has been rejected.");

            return Result.Success();
        }

        public async Task<Result<IEnumerable<LeaveRequestResponse>>> GetAllPendingRequestsAsync()
        {
            var response = await context.LeaveRequests.Where(x => x.Status == LeaveRequestStatus.Pending).Select(x => new LeaveRequestResponse
            {
                Id = x.Id,
                Type = x.Type,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                RequestedDays = x.RequestedDays,
                Reason = x.Reason,
                Status = x.Status,
                ReviewerName = x.Reviewer != null ? x.Reviewer.FullName : null,
                ReviewedAt = x.ReviewedAt,
                CreatedAt = x.CreatedAt,
                RequesterName = x.User.FullName
            }).ToListAsync();

            return Result<IEnumerable<LeaveRequestResponse>>.Success(response);
        }
    }
}
