using Microsoft.AspNetCore.Identity;
using MorFriesland.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MorFriesland.Models
{
    public class SeedAdminAccount
    {
        private readonly ApplicationDbContext _context;




        public SeedAdminAccount(ApplicationDbContext context)
        { 
            _context = context;
            
            
        }
        public static async Task Initialise(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            string[] roles = new string[] { "Admin", "Beheerder", "Gebruiker" };

            // string username = "Admin";
            string email = "MORFrieslandadmin@gmail.com";
            string password = "Admin123-";


            if (await userManager.FindByEmailAsync(email) == null)
            {
                foreach (string rol in roles)
                {
                    if (await roleManager.FindByNameAsync(rol) == null)
                    {
                        await roleManager.CreateAsync(new IdentityRole(rol));
                    }
                }
                var user = new ApplicationUser { UserName = email, Email = email };
                var result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Admin");
                }
            }

        }

    }



}
