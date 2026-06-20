using Microsoft.EntityFrameworkCore;
using Worknest.Application.Repositories;
using Worknest.Domain.Entities.Employee;
using Worknest.Domain.Entities.Team;

namespace Worknest.Infrastructure.Repositories
{
    public class TeamRepository : ITeamRepository
    {
        public readonly PrimaryDbContext _primaryDbContext;
        public TeamRepository(PrimaryDbContext primaryDbContext)
        {
            _primaryDbContext = primaryDbContext;
        }

        public  Task CreateTeam(Team team, CancellationToken cancellationToken) { 
            _primaryDbContext.Teams.AddAsync(team, cancellationToken);
            return Task.CompletedTask;
        }

        public async Task UpdateTeam(Team team, CancellationToken cancellationToken)
        {
            var existingTeam = await _primaryDbContext.Teams
                .FirstOrDefaultAsync(t => t.Id == team.Id, cancellationToken);
            
            if (existingTeam != null) 
            { 
                existingTeam.Name = team.Name;
                existingTeam.Description = team.Description;
                existingTeam.TeamLeaderId = team.TeamLeaderId;
                existingTeam.IsActive = team.IsActive;
            }
        }

        public async Task DeleteTeam(Guid id, CancellationToken cancellationToken)
        {
            var team = await _primaryDbContext.Teams
                .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

            if (team != null)
            {
                _primaryDbContext.Teams.Remove(team);
            }
        }
        public async Task AddMembersInTeam(Guid teamId, List<Guid> memberIds, CancellationToken cancellationToken)
        {
            var employees = await _primaryDbContext.Employees
                .Where(e => memberIds.Contains(e.Id))
                .ToListAsync(cancellationToken);

            foreach (var emp in employees)
            {
                emp.TeamId = teamId;
            }
        }

        public async Task RemoveMemberFromTeam(Guid teamId, Guid memberId, CancellationToken cancellationToken)
        {
            var employee = await _primaryDbContext.Employees
                .FirstOrDefaultAsync(e => e.Id == memberId && e.TeamId == teamId, cancellationToken);

            if (employee != null)
            {
                employee.TeamId = null;
            }
        }

        public async Task<Team?> GetTeamById(Guid id, CancellationToken cancellationToken)
        {
            return await _primaryDbContext.Teams
                .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        }
        public async Task<List<Team>> GetAllTeams(CancellationToken cancellationToken)
        {
            return await _primaryDbContext.Teams
                .Include(t => t.TeamMembers)
                .Include(t => t.TeamLeader)
                .ToListAsync(cancellationToken);
        }
        public async Task<Team?> GetTeamByTeamLeadId(Guid teamLeadId, CancellationToken cancellationToken)
        {
            return await _primaryDbContext.Teams
                .Include(t => t.TeamMembers)
                .Include(t => t.TeamLeader)
                .FirstOrDefaultAsync(t => t.TeamLeaderId == teamLeadId, cancellationToken);
        }

        public async Task<List<Employee>?> GetTeamMembers(Guid teamId, CancellationToken cancellationToken)
        {
            return await _primaryDbContext.Teams.Where(t => t.Id == teamId)
                .SelectMany(t => t.TeamMembers)
                .ToListAsync(cancellationToken);
        }

        public async Task ChangeTeamLeader(Guid teamId, Guid leaderId, CancellationToken cancellationToken) { 
            var team = await _primaryDbContext.Teams
                .FirstOrDefaultAsync(t => t.Id == teamId, cancellationToken);
            
            if (team is not null) 
            { 
                team.TeamLeaderId = leaderId;
                team.TeamLeader = await _primaryDbContext.Employees
                    .FirstOrDefaultAsync(e => e.Id == leaderId, cancellationToken);
            }
        }

    }
}
