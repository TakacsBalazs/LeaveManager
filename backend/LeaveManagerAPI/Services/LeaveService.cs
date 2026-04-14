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
    }
}
