namespace LeaveManagerAPI.Models.Responses
{
    public class LeaveBalanceResponse
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public string UserFullname { get; set; } = string.Empty;

        public int Year { get; set; }

        public LeaveType Type { get; set; }

        public int TotalDays { get; set; }

        public int UsedDays { get; set; }

        public int RemainingDays { get; set; }
    }
}
