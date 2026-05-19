namespace LeaveManagerAPI.Models.Requests
{
    public class GetLeaveRequestCalendarRequest
    {
        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }
    }
}
