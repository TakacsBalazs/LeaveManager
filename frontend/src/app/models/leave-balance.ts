export interface LeaveBalanceDto {
    type: string;
    totalDays: number;
    usedDays: number;
    remainingDays: number;
}

export interface LeaveBalanceResponse{
    id: number,
    userId: string,
    userFullname: string,
    year: number,
    type: string,
    totalDays: number,
    usedDays: number,
    remainingDays: number
}

export interface CreateLeaveBalanceRequest{
    userId: string,
    year: number,
    type: string,
    totalDays: number,
    usedDays: number
}

export interface UpdateLeaveBalanceRequest {
    totalDays: number
}