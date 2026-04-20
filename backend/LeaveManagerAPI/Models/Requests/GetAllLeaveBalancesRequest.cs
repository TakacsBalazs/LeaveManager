namespace LeaveManagerAPI.Models.Requests
{
    public class GetAllLeaveBalancesRequest
    {
        public string? UserFullname { get; set; }

        public int? Year { get; set; }

        public LeaveType? Type { get; set; }
    }
}
