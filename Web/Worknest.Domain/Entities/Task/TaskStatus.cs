using System;
using System.Collections.Generic;
using System.Text;

namespace Worknest.Domain.Entities.Task
{
    public enum TaskStatus
    {
        ToDo = 1,
        InProgress = 2,
        InReview = 3,
        Completed = 4,
        Blocked = 5,
        Cancelled = 6  
    }
}
