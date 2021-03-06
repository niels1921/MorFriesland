﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MorFriesland.Models;
using MorFriesland.Models.AccountViewModels;

namespace MorFriesland.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }

        public DbSet<MorFriesland.Models.Melding> Melding { get; set; }

        public DbSet<MorFriesland.Models.Categorie> Categorie { get; set; }

        public DbSet<MorFriesland.Models.AccountViewModels.AddRoleUserViewModel> AddRoleUserViewModel { get; set; }

        public DbSet<MorFriesland.Models.Bronhouder> Bronhouder { get; set; }
    }
}
