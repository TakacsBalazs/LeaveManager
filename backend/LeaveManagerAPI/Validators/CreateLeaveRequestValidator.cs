using FluentValidation;
using LeaveManagerAPI.Models.Requests;

namespace LeaveManagerAPI.Validators
{
    public class CreateLeaveRequestValidator : AbstractValidator<CreateLeaveRequest>
    {
        public CreateLeaveRequestValidator()
        {
            RuleFor(x => x.Type).IsInEnum();
            RuleFor(x => x.StartDate).NotEmpty().GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow));
            RuleFor(x => x.EndDate).NotEmpty().GreaterThanOrEqualTo(x => x.StartDate);
            RuleFor(x => x.Reason).MaximumLength(250);
        }
    }
}
