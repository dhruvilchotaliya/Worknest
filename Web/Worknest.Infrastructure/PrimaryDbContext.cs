using Microsoft.EntityFrameworkCore;
using Worknest.Domain.Entities.Project;
using Worknest.Domain.Entities.Team;
using Worknest.Domain.Entities.Employee;
using Worknest.Domain.Entities.Task;

namespace Worknest.Infrastructure
{
    public class PrimaryDbContext : DbContext
    {
        public PrimaryDbContext(DbContextOptions<PrimaryDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects => Set<Project>();
        public DbSet<Team> Teams => Set<Team>();
        public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<ProjectTask> ProjectTasks => Set<ProjectTask>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Employee
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employees");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(e => e.Surname)
                    .IsRequired()
                    .HasMaxLength(100);

                // Team relationship
                entity.HasOne(e => e.Team)
                    .WithMany(t => t.TeamMembers)
                    .HasForeignKey(e => e.TeamId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

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
                entity.HasOne(e => e.TeamLeader)
                    .WithOne(t => t.LedTeam)
                    .HasForeignKey<Team>(e => e.TeamLeaderId)
                    .OnDelete(DeleteBehavior.Restrict);
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
                entity.Property(e => e.RemovedReason)
                    .HasMaxLength(1000);

                entity.Property(e => e.ProjectRole)
                    .HasConversion<int>(); // store role as int in db

                // Project relationship
                entity.HasOne(e => e.Project)
                    .WithMany(p => p.Members)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Employee relationship
                entity.HasOne(e => e.Employee)
                    .WithMany()
                    .HasForeignKey(e => e.EmployeeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure ProjectTask
            modelBuilder.Entity<ProjectTask>(entity =>
            {
                entity.ToTable("ProjectTasks");
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .HasMaxLength(2000);

                entity.Property(e => e.Status)
                    .HasConversion<int>();

                entity.Property(e => e.Priority)
                    .HasConversion<int>();

                entity.Property(e => e.EstimatedHours)
                    .HasPrecision(18, 2);

                entity.Property(e => e.CompletedHours)
                    .HasPrecision(18, 2);

                entity.Property(e => e.RemainingHours)
                    .HasPrecision(18, 2);

                entity.Property(e => e.AttachmentUrl)
                    .HasMaxLength(1000);

                entity.Property(e => e.ReferenceLink)
                    .HasMaxLength(1000);

                // Project relationship
                entity.HasOne(e => e.Project)
                    .WithMany(p => p.ProjectTasks)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Assigned Employee relationship
                entity.HasOne(e => e.AssignedToEmployee)
                    .WithMany(emp => emp.AssignedTasks)
                    .HasForeignKey(e => e.AssignedToEmployeeId)
                    .OnDelete(DeleteBehavior.SetNull);

                // Creator Employee relationship
                entity.HasOne(e => e.CreatedByEmployee)
                    .WithMany(emp => emp.CreatedTasks)
                    .HasForeignKey(e => e.CreatedByEmployeeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
