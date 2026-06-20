using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectService.Domain.Entities
{
    public enum ProjectRole
    {
        ProjectManager = 1,
        TeamLeader = 2,
        Developer = 3,
        Tester = 4,
        DevOpsEngineer = 5,
        BusinessAnalyst = 6,
        Designer = 7
    }
}
