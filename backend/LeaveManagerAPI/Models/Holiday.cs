namespace LeaveManagerAPI.Models
{
    public class Holiday
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public DateOnly Date { get; set; }
    }
}
