using LeaveManagerAPI.Constants;
using LeaveManagerAPI.Models;
using Microsoft.AspNetCore.Identity;

namespace LeaveManagerAPI.Data
{
    public class DatabaseSeeder
    {
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly UserManager<User> userManager;

        public DatabaseSeeder(RoleManager<IdentityRole> roleManager, UserManager<User> userManager)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
        }

        public async Task SeedDataAsync()
        {
            if(!await roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                var adminRole = new IdentityRole(UserRoles.Admin);
                await roleManager.CreateAsync(adminRole);
            }

            if(!await roleManager.RoleExistsAsync(UserRoles.Employee))
            {
                var employeeRole = new IdentityRole(UserRoles.Employee);
                await roleManager.CreateAsync(employeeRole);
            }

            string adminEmail = "admin@admin.hu";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null) {

                var newAdmin = new User
                {
                    FullName = "Admin",
                    Email = adminEmail,
                    UserName = adminEmail
                };

                var result = await userManager.CreateAsync(newAdmin, "Pelda123!");

                if(result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdmin, UserRoles.Admin);
                }

            }
        }
    }
}
