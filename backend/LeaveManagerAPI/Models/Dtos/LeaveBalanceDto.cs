namespace LeaveManagerAPI.Models.Dtos
{
    public class LeaveBalanceDto
    {
        public int Year { get; set; }

        public LeaveType Type { get; set; }

        public int TotalDays { get; set; }

        public int UsedDays { get; set; }

        public int RemainingDays { get; set; }
    }
}
