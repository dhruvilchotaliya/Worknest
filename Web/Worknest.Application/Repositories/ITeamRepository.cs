using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Worknest.Domain.Entities.Team;

namespace Worknest.Application.Repositories
{
    public interface ITeamRepository
    {
        Task CreateTeam(Team team, CancellationToken cancellationToken);
        Task UpdateTeam(Team team, CancellationToken cancellationToken);
        Task DeleteTeam(Guid id, CancellationToken cancellationToken);
        Task AddMembersInTeam(Guid teamId, List<Guid> memberIds, CancellationToken cancellationToken);
        Task RemoveMemberFromTeam(Guid teamId, Guid memberId, CancellationToken cancellationToken);
        Task<Team?> GetTeamById(Guid id, CancellationToken cancellationToken);
        Task<List<Team>> GetAllTeams(CancellationToken cancellationToken);
        Task<Team?> GetTeamByTeamLeadId(Guid teamLeadId, CancellationToken cancellationToken);
        Task ChangeTeamLeader(Guid teamId, Guid leaderId, CancellationToken cancellationToken);
    }
}
