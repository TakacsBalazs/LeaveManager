using LeaveManagerAPI.Common;
using LeaveManagerAPI.Data;
using LeaveManagerAPI.Models;
using LeaveManagerAPI.Models.Dtos;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagerAPI.Services
{
    public class LeaveService : ILeaveService
    {
        private readonly AppDbContext context;

        public LeaveService(AppDbContext context)
        {
            this.context = context;
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
            var balance = await context.LeaveBalances.FirstOrDefaultAsync(x => x.Type == request.Type && x.Year == DateTime.UtcNow.Year && x.UserId == userId);
            if(balance == null)
            {
                return Result.Failure("Invalid leave request!");
            }

            DateOnly current = request.StartDate;

            int workingDays = 0;

            while (current <= request.EndDate)
            {
                if (current.DayOfWeek != DayOfWeek.Saturday && current.DayOfWeek != DayOfWeek.Sunday)
                {
                    workingDays++;
                }
                current = current.AddDays(1);
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

            return Result.Success();
        }
    }
}
