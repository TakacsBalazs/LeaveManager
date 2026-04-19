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

export interface LeaveRequestDto{
    id: number,
    type: string,
    startDate: string,
    endDate: string,
    requestedDays: number,
    reason: string | null,
    status: string,
    reviewerName: string | null,
    reviewedAt: string | null,
    createdAt: string,
    requesterName: string
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