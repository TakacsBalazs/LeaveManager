using LeaveManagerAPI.Common;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;
using LeaveManagerAPI.Models;
using LeaveManagerAPI.Data;
using Microsoft.EntityFrameworkCore;
using LeaveManagerAPI.Extensions;

namespace LeaveManagerAPI.Services
{
    public class LeaveBalanceService : ILeaveBalanceService
    {
        private readonly AppDbContext context;
        private readonly IServiceProvider serviceProvider;

        public LeaveBalanceService(AppDbContext context, IServiceProvider serviceProvider)
        {
            this.context = context;
            this.serviceProvider = serviceProvider;

        }
        public async Task<Result<IEnumerable<LeaveBalanceResponse>>> GetAllLeaveBalancesAsync()
        {
            var response = await context.LeaveBalances.Select(x => new LeaveBalanceResponse
            {
                Id = x.Id,
                Type = x.Type,
                UsedDays = x.UsedDays,
                TotalDays = x.TotalDays,
                UserId = x.UserId,
                UserFullname = x.User.FullName,
                RemainingDays = x.RemainingDays,
                Year = x.Year
            }).ToListAsync();

            return Result<IEnumerable<LeaveBalanceResponse>>.Success(response);
        }

        public async Task<Result<LeaveBalanceResponse>> CreateLeaveBalanceAsync(CreateLeaveBalanceRequest request)
        {
            var validate = await serviceProvider.ValidateRequestAsync<CreateLeaveBalanceRequest>(request);
            if (!validate.IsSuccess)
            {
                return Result<LeaveBalanceResponse>.Failure(validate.Errors);
            }

            var user = await context.Users.FindAsync(request.UserId);
            if (user == null)
            {
                return Result<LeaveBalanceResponse>.Failure("User not found!");
            }

            var hasSameLeaveBalance = await context.LeaveBalances.AnyAsync(x => x.Year == request.Year && x.UserId == request.UserId && x.Type == request.Type);
            if (hasSameLeaveBalance)
            {
                return Result<LeaveBalanceResponse>.Failure("There is another leave balance!");
            }

            var leaveBalance = new LeaveBalance
            {
                UserId = request.UserId,
                Type = request.Type,
                TotalDays = request.TotalDays,
                UsedDays = request.UsedDays,
                Year = request.Year
            };
            context.LeaveBalances.Add(leaveBalance);
            await context.SaveChangesAsync();

            var response = new LeaveBalanceResponse
            {
                Id = leaveBalance.Id,
                UserId = leaveBalance.UserId,
                UserFullname = user.FullName,
                Type = leaveBalance.Type,
                TotalDays = leaveBalance.TotalDays,
                UsedDays = leaveBalance.UsedDays,
                Year = leaveBalance.Year,
                RemainingDays = leaveBalance.RemainingDays
            };

            return Result<LeaveBalanceResponse>.Success(response);
        }

        public async Task<Result<LeaveBalanceResponse>> UpdateLeaveBalanceAsync(UpdateLeaveBalanceRequest request, int id)
        {
            var validate = await serviceProvider.ValidateRequestAsync<UpdateLeaveBalanceRequest>(request);
            if (!validate.IsSuccess)
            {
                return Result<LeaveBalanceResponse>.Failure(validate.Errors);
            }

            var leaveBalance = await context.LeaveBalances.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == id);
            if (leaveBalance == null)
            {
                return Result<LeaveBalanceResponse>.Failure("Invalid Id!");
            }

            if (leaveBalance.UsedDays > request.TotalDays)
            {
                return Result<LeaveBalanceResponse>.Failure("Total days cannot less than used days!");
            }

            leaveBalance.TotalDays = request.TotalDays;
            await context.SaveChangesAsync();

            var response = new LeaveBalanceResponse
            {
                Id = leaveBalance.Id,
                UserId = leaveBalance.UserId,
                UserFullname = leaveBalance.User.FullName,
                Type = leaveBalance.Type,
                TotalDays = leaveBalance.TotalDays,
                UsedDays = leaveBalance.UsedDays,
                Year = leaveBalance.Year,
                RemainingDays = leaveBalance.RemainingDays
            };

            return Result<LeaveBalanceResponse>.Success(response);
        }

        public async Task<Result> DeleteLeaveBalanceAsync(int id)
        {
            var leaveBalance = await context.LeaveBalances.FindAsync(id);
            if (leaveBalance == null)
            {
                return Result.Failure("Invalid Id!");
            }
            context.LeaveBalances.Remove(leaveBalance);
            await context.SaveChangesAsync();

            return Result.Success();
        }
    }
}
