using System.Net;
using System.Text.Json;

namespace LeaveManagerAPI.Middleware
{
	public class GlobalExceptionHandlerMiddleware
	{
		private readonly RequestDelegate next;
		private readonly ILogger<GlobalExceptionHandlerMiddleware> logger;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;
        }

        public async Task InvokeAsync(HttpContext context) 
        {
			try
			{
				await next(context);
			}
			catch (Exception ex)
			{
				logger.LogError(ex, "Internal Server Error: {Message}", ex.Message);

				context.Response.ContentType = "application/json";
				context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

				var response = new
				{
					Message = "Internal Server Error. Please try again later.",
				};

				var json = JsonSerializer.Serialize(response);

				await context.Response.WriteAsync(json);
			}
        }
    }
}
