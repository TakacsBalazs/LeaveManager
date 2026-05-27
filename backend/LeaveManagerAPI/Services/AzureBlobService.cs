using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using LeaveManagerAPI.Common;

namespace LeaveManagerAPI.Services
{
    public class AzureBlobService : IAzureBlobService
    {
        private readonly BlobServiceClient blobServiceClient;
        public AzureBlobService(BlobServiceClient blobServiceClient)
        {
            this.blobServiceClient = blobServiceClient;
        }

        public async Task<Result<string>> UploadAsync(Stream stream, string fileName, string folderName, string contentType)
        {
            var container = blobServiceClient.GetBlobContainerClient(folderName);

            await container.CreateIfNotExistsAsync();

            string blobPath = $"{Guid.NewGuid()}_{fileName}";

            var blobClient = container.GetBlobClient(blobPath);

            await blobClient.UploadAsync(stream, new BlobUploadOptions{
                HttpHeaders = new BlobHttpHeaders { ContentType = contentType }
            });

            return Result<string>.Success(blobPath);
        }
    }
}
