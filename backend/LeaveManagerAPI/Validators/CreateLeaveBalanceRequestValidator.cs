using FluentValidation;
using LeaveManagerAPI.Models.Requests;

namespace LeaveManagerAPI.Validators
{
    public class CreateLeaveBalanceRequestValidator : AbstractValidator<CreateLeaveBalanceRequest>
    {
        public CreateLeaveBalanceRequestValidator()
        {
            RuleFor(x => x.TotalDays).GreaterThanOrEqualTo(0);
            RuleFor(x => x.UsedDays).GreaterThanOrEqualTo(0).LessThanOrEqualTo(x => x.TotalDays);
            RuleFor(x => x.Year).NotEmpty().GreaterThanOrEqualTo(DateTime.UtcNow.Year);
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.Type).IsInEnum();
        }
    }
}
