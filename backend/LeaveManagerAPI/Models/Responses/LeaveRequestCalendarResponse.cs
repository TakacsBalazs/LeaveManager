namespace LeaveManagerAPI.Models.Responses
{
    public class LeaveRequestCalendarResponse
    {
        public int Id { get; set; }

        public LeaveType Type { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public LeaveRequestStatus Status { get; set; }

        public string RequesterName { get; set; } = string.Empty;
    }
}
