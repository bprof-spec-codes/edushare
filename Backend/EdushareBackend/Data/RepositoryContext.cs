using Entities.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public class RepositoryContext : IdentityDbContext
    {
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Material> Materials { get; set; }

        public DbSet<Subject> Subjects { get; set; }

        
        public RepositoryContext(DbContextOptions<RepositoryContext> ctx) : base(ctx)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Material>()
                .HasOne(u => u.Uploader)
                .WithMany(m => m.Materials);


            base.OnModelCreating(modelBuilder);
        }
    }
}
