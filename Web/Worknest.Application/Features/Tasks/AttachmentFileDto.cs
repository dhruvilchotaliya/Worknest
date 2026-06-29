using System.IO;

namespace Worknest.Application.Features.Tasks
{
    public class AttachmentFileDto
    {
        public Stream FileStream { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public string ContentType { get; set; } = null!;
    }
}
