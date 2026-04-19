namespace LeaveManagerAPI.Models.Responses
{
    public class UserResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Fullname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public IEnumerable<string> Roles { get; set; } = new List<string>();
    }
}
