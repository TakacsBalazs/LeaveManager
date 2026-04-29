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

        public async Task<Result<IEnumerable<HolidayResponse>>> GetAllHolidaysAsync()
        {
            var response = await context.Holidays.Select(x => new HolidayResponse
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
    }
}
