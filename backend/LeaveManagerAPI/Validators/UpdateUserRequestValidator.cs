using FluentValidation;
using LeaveManagerAPI.Constants;
using LeaveManagerAPI.Models.Requests;

namespace LeaveManagerAPI.Validators
{
    public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
    {
        public UpdateUserRequestValidator() {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Fullname).NotEmpty();
            RuleFor(x => x.Roles).NotEmpty();
            RuleForEach(x => x.Roles).Must(role => UserRoles.IsRoleExist(role)).WithMessage("Invalid role!");
        }
    }
}
