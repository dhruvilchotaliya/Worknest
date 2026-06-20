using System;
using System.Collections.Generic;
using System.Text;

namespace Worknest.Domain.Entities.Project
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
