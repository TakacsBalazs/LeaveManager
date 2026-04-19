namespace LeaveManagerAPI.Models.Requests
{
    public class UpdateUserRequest
    {
        public string Fullname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public IEnumerable<string> Roles { get; set; } = new List<string>();
    }
}
