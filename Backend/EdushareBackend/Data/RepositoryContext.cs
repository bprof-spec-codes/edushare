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
        public DbSet<Rating> Ratings { get; set; }



        public RepositoryContext(DbContextOptions<RepositoryContext> ctx) : base(ctx)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Material>()
                .HasOne(u => u.Uploader)
                .WithMany(m => m.Materials);

            modelBuilder.Entity<AppUser>()
                .HasMany(u => u.FavouriteMaterials)
                .WithMany(m => m.UsersWhoFavourited)
                .UsingEntity(j => j.ToTable("AppUserFavouriteMaterials"));


            base.OnModelCreating(modelBuilder);
        }
    }
}
