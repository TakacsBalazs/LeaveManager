namespace LeaveManagerAPI.Models.Requests
{
    public class GetUsersRequest
    {
        public string? Fullname { get; set; }
        public string? Email { get; set;}

        public IEnumerable<string>? Roles { get; set; }
    }
}
