using LeaveManagerAPI.Common;
using LeaveManagerAPI.Data;
using LeaveManagerAPI.Extensions;
using LeaveManagerAPI.Models;
using LeaveManagerAPI.Models.Requests;
using LeaveManagerAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagerAPI.Services
{
    public class HolidayService : IHolidayService
    {
        private readonly AppDbContext context;
        private readonly IServiceProvider serviceProvider;

        public HolidayService(AppDbContext context, IServiceProvider serviceProvider)
        {
            this.context = context;
            this.serviceProvider = serviceProvider;
        }

        public async Task<Result<IEnumerable<HolidayResponse>>> GetAllHolidaysAsync(GetHolidaysRequest request)
        {
            var query = context.Holidays.AsQueryable();
            if(request.MinDate.HasValue)
            {
                query = query.Where(x => x.Date >= request.MinDate);
            }

            if (request.MaxDate.HasValue)
            {
                query = query.Where(x => x.Date <= request.MaxDate);
            }

            var response = await query.Select(x => new HolidayResponse
            {
                Id = x.Id,
                Name = x.Name,
                Date = x.Date
            }).ToListAsync();

            return Result<IEnumerable<HolidayResponse>>.Success(response);
        }

        public async Task<Result<HolidayResponse>> CreateHolidayAsync(CreateHolidayRequest request)
        {
            var validate = await serviceProvider.ValidateRequestAsync<CreateHolidayRequest>(request);
            if(!validate.IsSuccess)
            {
                return Result<HolidayResponse>.Failure(validate.Errors);
            }

            var hasSameDate = await context.Holidays.AnyAsync(x => x.Date ==  request.Date);
            if(hasSameDate)
            {
                return Result<HolidayResponse>.Failure("There is a same holiday!");
            }

            var holiday = new Holiday
            {
                Name = request.Name,
                Date = request.Date
            };

            context.Holidays.Add(holiday);
            await context.SaveChangesAsync();

            var response = new HolidayResponse
            {
                Id = holiday.Id,
                Name = request.Name,
                Date = request.Date
            };
            return Result<HolidayResponse>.Success(response);
        }

        public async Task<Result> DeleteHolidayAsync(int id)
        {
            var holiday = await context.Holidays.FindAsync(id);
            if(holiday == null)
            {
                return Result.Failure("Invalid Id!");
            }

            context.Holidays.Remove(holiday);
            await context.SaveChangesAsync();

            return Result.Success();
        }
    }
}
