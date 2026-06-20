using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectService.Domain.Entities
{
    public enum ProjectStatus
    {
        Planning = 1,
        Active = 2,
        OnHold = 3,
        Completed = 4,
        Cancelled = 5
    }
}
