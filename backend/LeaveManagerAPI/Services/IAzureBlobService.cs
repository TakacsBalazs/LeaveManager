using LeaveManagerAPI.Common;

namespace LeaveManagerAPI.Services
{
    public interface IAzureBlobService
    {
        Task<Result<string>> UploadAsync(Stream stream, string fileName, string folderName, string contentType);
    }
}
