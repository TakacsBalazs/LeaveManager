using LeaveManagerAPI.Common;

namespace LeaveManagerAPI.Services
{
    public interface IAzureBlobService
    {
        Task<Result<string>> UploadAsync(Stream stream, string fileName, string folderName, string contentType);

        Task DeleteFileAsync(string folderName, string blobName);

        string GetProtectedUrl(string folderName, string blobName);
    }
}
