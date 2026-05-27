using Microsoft.AspNetCore.Http;

namespace LeaveManagerAPI.Models.Requests
{
    public class UploadProfilePictureRequest
    {
        public IFormFile File { get; set; }
    }
}
