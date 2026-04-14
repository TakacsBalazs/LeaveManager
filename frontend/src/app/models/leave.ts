export interface LeaveBalanceDto {
    type: string;
    totalDays: number;
    usedDays: number;
    remainingDays: number;
}

export interface CreateLeaveRequestDto{
    type: number,
    startDate: string,
    endDate: string,
    reason: string | null
}
