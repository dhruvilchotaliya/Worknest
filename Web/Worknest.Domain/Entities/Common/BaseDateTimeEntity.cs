using System;
using System.Collections.Generic;
using System.Text;

namespace Worknest.Domain.Entities.Common
{
    public class BaseDateTimeEntity
    {
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }
}
