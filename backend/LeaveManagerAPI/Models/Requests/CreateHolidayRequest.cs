namespace LeaveManagerAPI.Models.Requests
{
    public class CreateHolidayRequest
    {
        public string Name { get; set; }

        public DateOnly Date { get; set; }
    }
}
