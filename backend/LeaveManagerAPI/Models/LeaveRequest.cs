namespace LeaveManagerAPI.Models
{
    public enum LeaveRequestStatus
    {
        Pending,
        Approved,
        Rejected,
        Cancelled
    }
    public class LeaveRequest
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public User User { get; set; }

        public LeaveType Type { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public int RequestedDays { get; set; }

        public string? Reason { get; set; }

        public LeaveRequestStatus Status { get; set; }

        public string? ReviewerId { get; set; }

        public User Reviewer { get; set; }

        public DateTime? ReviewedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
