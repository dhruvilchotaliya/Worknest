using System;

namespace Worknest.Application.Exceptions
{
    public class ConflictException : Exception
    {
        public ConflictException() : base("A conflict occurred.")
        {
        }

        public ConflictException(string message) : base(message)
        {
        }

        public ConflictException(string message, Exception innerException) : base(message, innerException)
        {
        }

        public ConflictException(string name, object key) : base($"Entity \"{name}\" ({key}) is in conflict.")
        {
        }
    }
}
