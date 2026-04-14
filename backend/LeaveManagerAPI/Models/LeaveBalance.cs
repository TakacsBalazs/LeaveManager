namespace LeaveManagerAPI.Models
{
    public enum LeaveType
    {
        AnnualLeave,
        SickLeave,
        Unpaid
    }
    public class LeaveBalance
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public User User { get; set; }

        public int Year { get; set; }

        public LeaveType Type { get; set; }

        public int TotalDays { get; set; }

        public int UsedDays { get; set; }

        public int RemainingDays => TotalDays - UsedDays;
    }
}
