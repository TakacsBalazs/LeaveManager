using FluentValidation;
using LeaveManagerAPI.Models.Requests;

namespace LeaveManagerAPI.Validators
{
    public class UpdateLeaveBalanceRequestValidator : AbstractValidator<UpdateLeaveBalanceRequest>
    {
        public UpdateLeaveBalanceRequestValidator() {
            RuleFor(x => x.TotalDays).GreaterThanOrEqualTo(0);
        }
    }
}
