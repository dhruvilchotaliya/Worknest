using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Worknest.Application.Exceptions;
using Worknest.Api.Models;

namespace Worknest.Api.Middlewares
{
    public class GlobalExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

        public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred processing the request.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var statusCode = exception switch
            {
                BadRequestException => (int)HttpStatusCode.BadRequest, // 400
                ArgumentException => (int)HttpStatusCode.BadRequest, // 400
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized, // 401
                ForbiddenException => (int)HttpStatusCode.Forbidden, // 403
                NotFoundException => (int)HttpStatusCode.NotFound, // 404
                ConflictException => (int)HttpStatusCode.Conflict, // 409
                InvalidOperationException => (int)HttpStatusCode.Conflict, // 409
                _ => (int)HttpStatusCode.InternalServerError // 500
            };

            context.Response.StatusCode = statusCode;

            var message = exception switch
            {
                BadRequestException => exception.Message,
                ArgumentException => exception.Message,
                UnauthorizedAccessException => exception.Message,
                ForbiddenException => exception.Message,
                NotFoundException => exception.Message,
                ConflictException => exception.Message,
                InvalidOperationException => exception.Message,
                _ => "Something went wrong. Please try again later."
            };

            var errorResponse = new ErrorResponse
            {
                StatusCode = statusCode,
                Message = message,
                TraceId = context.TraceIdentifier
            };

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var result = JsonSerializer.Serialize(errorResponse, jsonOptions);
            await context.Response.WriteAsync(result);
        }
    }
}
