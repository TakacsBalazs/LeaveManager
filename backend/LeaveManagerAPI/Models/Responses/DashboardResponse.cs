using LeaveManagerAPI.Models.Dtos;

namespace LeaveManagerAPI.Models.Responses
{
    public class DashboardResponse
    {
        public List<LeaveBalanceDto> Balances { get; set; }
    }
}
