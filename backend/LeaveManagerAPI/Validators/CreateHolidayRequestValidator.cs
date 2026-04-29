using FluentValidation;
using LeaveManagerAPI.Models.Requests;

namespace LeaveManagerAPI.Validators
{
    public class CreateHolidayRequestValidator : AbstractValidator<CreateHolidayRequest>
    {
        public CreateHolidayRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Date).NotEmpty();
        }
    }
}
