using System;
using Worknest.Domain.Entities.Common;

namespace Worknest.Domain.Entities.Project
{
    public class ProjectMember : BaseEntity
    {
        public Guid ProjectId { get; set; }
        public Project? Project { get; set; }

        public Guid EmployeeId { get; set; }
        public Employee.Employee? Employee { get; set; }

        public ProjectRole ProjectRole { get; set; }

        public string? RemovedReason { get; set; }
    }
}
