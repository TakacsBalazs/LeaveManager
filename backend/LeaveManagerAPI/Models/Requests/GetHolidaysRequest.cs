namespace LeaveManagerAPI.Models.Requests
{
    public class GetHolidaysRequest
    {
        public DateOnly? MinDate { get; set; }

        public DateOnly? MaxDate { get; set; }
    }
}
