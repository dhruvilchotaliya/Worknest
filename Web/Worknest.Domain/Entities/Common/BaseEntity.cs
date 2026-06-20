using System;
using System.Collections.Generic;
using System.Text;

namespace Worknest.Domain.Entities.Common
{
    public class BaseEntity : BaseDateTimeEntity
    {
        public Guid Id { get; set; }
    }
}
