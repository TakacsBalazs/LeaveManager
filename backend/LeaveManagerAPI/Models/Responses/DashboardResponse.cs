using LeaveManagerAPI.Models.Dtos;

namespace LeaveManagerAPI.Models.Responses
{
    public class DashboardResponse
    {

        public string? ProfilePictureUrl { get; set; }
        public List<LeaveBalanceDto> Balances { get; set; }
    }
}
