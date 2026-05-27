namespace LeaveManagerAPI.Models.Responses
{
    public class LeaveRequestResponse
    {
        public int Id { get; set; }

        public LeaveType Type { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public int RequestedDays { get; set; }

        public string? Reason { get; set; }

        public LeaveRequestStatus Status { get; set; }

        public string? ReviewerName { get; set; }

        public DateTime? ReviewedAt { get; set; }

        public string RequesterName { get; set; } = string.Empty;

        public string? RequesterProfilePictureUrl { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
