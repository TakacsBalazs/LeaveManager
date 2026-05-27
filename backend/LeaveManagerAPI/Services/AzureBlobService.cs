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

        public async Task DeleteFileAsync(string folderName, string blobName)
        {
            var container = blobServiceClient.GetBlobContainerClient(folderName);
            var blobClient = container.GetBlobClient(blobName);

            await blobClient.DeleteIfExistsAsync();
        }

        public string GetProtectedUrl(string folderName, string blobName)
        {
            var container = blobServiceClient.GetBlobContainerClient(folderName);
            var blobClient = container.GetBlobClient(blobName);


            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = container.Name,
                BlobName = blobClient.Name,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(10)
            };

            sasBuilder.SetPermissions(BlobAccountSasPermissions.Read);

            Uri sasUri = blobClient.GenerateSasUri(sasBuilder);

            return sasUri.ToString();
        }
    }
}
