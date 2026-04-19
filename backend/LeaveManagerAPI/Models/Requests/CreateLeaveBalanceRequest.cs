namespace LeaveManagerAPI.Models.Requests
{
    public class CreateLeaveBalanceRequest
    {
        public string UserId { get; set; } = string.Empty;

        public int Year { get; set; }

        public LeaveType Type { get; set; }

        public int TotalDays { get; set; }

        public int UsedDays { get; set; }
    }
}
