namespace LeaveManagerAPI.Constants
{
    public static class UserRoles
    {
        public const string Admin = "Admin";
        public const string Employee = "Employee";

        public static readonly string[] All = { Admin, Employee };
        public static bool IsRoleExist(string role)
        {
            return All.Contains(role);
        }
    }
}
