using Microsoft.EntityFrameworkCore;
using ProjectService.Domain.Entities;

namespace ProjectService.Infrastructure.Data
{
    public class ProjectDbContext : DbContext
    {
        public ProjectDbContext(DbContextOptions<ProjectDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects => Set<Project>();
        public DbSet<Team> Teams => Set<Team>();
        public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Team
            modelBuilder.Entity<Team>(entity =>
            {
                entity.ToTable("Teams");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.Description)
                    .HasMaxLength(2000);
            });

            // Configure Project
            modelBuilder.Entity<Project>(entity =>
            {
                entity.ToTable("Projects");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.Code)
                    .HasMaxLength(50);
                entity.Property(e => e.Description)
                    .HasMaxLength(2000);
                entity.Property(e => e.ClientName)
                    .HasMaxLength(200);

                entity.Property(e => e.Status)
                    .HasConversion<int>(); // store status as int in db

                // Team relationship
                entity.HasOne(e => e.Team)
                    .WithMany(t => t.Projects)
                    .HasForeignKey(e => e.TeamId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure ProjectMember
            modelBuilder.Entity<ProjectMember>(entity =>
            {
                entity.ToTable("ProjectMembers");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Notes)
                    .HasMaxLength(1000);
                entity.Property(e => e.RemovedReason)
                    .HasMaxLength(1000);

                entity.Property(e => e.ProjectRole)
                    .HasConversion<int>(); // store role as int in db

                // Project relationship
                entity.HasOne(e => e.Project)
                    .WithMany(p => p.Members)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
