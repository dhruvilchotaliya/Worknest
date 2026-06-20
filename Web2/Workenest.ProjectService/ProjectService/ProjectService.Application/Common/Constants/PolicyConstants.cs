using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectService.Application.Common.Constants
{
    public static class PolicyConstants
    {
        public readonly static string RequireAdmin = "RequireAdmin";

        public readonly static string RequireProjectManager = "RequireProjectManager";

        public readonly static string RequireTeamLeader = "RequireTeamLeader";

        public readonly static string RequireDeveloper = "RequireDeveloper";

        public readonly static string RequireFellowDeveloper = "RequireFellowDeveloper";

        public readonly static string RequireWorkContributor = "RequireWorkContributor";

        public readonly static string RequireAnyUser = "RequireAnyUser";
    }
}
