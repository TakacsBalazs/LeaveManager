namespace LeaveManagerAPI.Models.Requests
{
    public class CreateLeaveRequest
    { 

        public LeaveType Type { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public string? Reason { get; set; }

    }
}
