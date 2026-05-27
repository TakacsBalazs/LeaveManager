using Microsoft.AspNetCore.Identity;

namespace LeaveManagerAPI.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;

        public string? ProfilePictureUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
