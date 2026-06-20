using System;
using System.Collections.Generic;

namespace Worknest.Application.Exceptions
{
    public class BadRequestException : Exception
    {
        public IDictionary<string, string[]> Errors { get; }

        public BadRequestException() : base("One or more validation failures have occurred.")
        {
            Errors = new Dictionary<string, string[]>();
        }

        public BadRequestException(string message) : base(message)
        {
            Errors = new Dictionary<string, string[]>();
        }

        public BadRequestException(IDictionary<string, string[]> errors) : this()
        {
            Errors = errors;
        }
    }
}
