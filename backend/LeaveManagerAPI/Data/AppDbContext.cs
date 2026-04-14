using LeaveManagerAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagerAPI.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base (options)
        {
            
        }

        public DbSet<LeaveBalance> LeaveBalances { get; set; }

        public DbSet<LeaveRequest> LeaveRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>(entity =>
            {
                entity.Property(x => x.FullName).IsRequired().HasMaxLength(100);
                entity.Property(x => x.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");
            });

            builder.Entity<LeaveBalance>(entity =>
            {
                entity.Property(x => x.Type).IsRequired();
                entity.Property(x => x.TotalDays).IsRequired();
                entity.Property(x => x.UsedDays).IsRequired();
                entity.Property(x => x.Year).IsRequired();
                entity.Property(x => x.UserId).IsRequired();

                entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(x => new { x.UserId, x.Year, x.Type }).IsUnique();
            });

            builder.Entity<LeaveRequest>(entity =>
            {
                entity.Property(x => x.UserId).IsRequired();
                entity.Property(x => x.Type).IsRequired();
                entity.Property(x => x.StartDate).IsRequired();
                entity.Property(x => x.EndDate).IsRequired();
                entity.Property(x => x.RequestedDays).IsRequired();
                entity.Property(x => x.Reason).IsRequired(false).HasMaxLength(250);
                entity.Property(x => x.Status).IsRequired();
                entity.Property(x => x.ReviewerId).IsRequired(false);
                entity.Property(x => x.ReviewedAt).IsRequired(false);
                entity.Property(x => x.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(x => x.Reviewer).WithMany().HasForeignKey(x => x.ReviewerId).OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}