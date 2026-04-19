using FluentValidation;
using LeaveManagerAPI.Models.Requests;

namespace LeaveManagerAPI.Validators
{
    public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
    {
        public ChangePasswordRequestValidator()
        {
            RuleFor(x => x.OldPassword).NotEmpty();
            RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(6);
            RuleFor(x => x.ConfirmNewPassword).NotEmpty().Equal(x => x.NewPassword);
        }
    }
}
