using FluentValidation;
using LeaveManagerAPI.Constants;
using LeaveManagerAPI.Models.Requests;

namespace LeaveManagerAPI.Validators
{
    public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
    {
        public CreateUserRequestValidator()
        {
            RuleFor(x => x.FullName).NotEmpty();
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).MinimumLength(6);
            RuleFor(x => x.Roles).NotEmpty();
            RuleForEach(x => x.Roles).Must(role => UserRoles.IsRoleExist(role)).WithMessage("Invalid role!");
        }
    }
}
