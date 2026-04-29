namespace LeaveManagerAPI.Models.Responses
{
    public class HolidayResponse
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public DateOnly Date { get; set; }
    }
}
