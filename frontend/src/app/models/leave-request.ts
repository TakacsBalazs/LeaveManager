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

export interface FilterLeaveRequestCalendar {
    startDate: string,
    endDate: string
}

export interface LeaveRequestCalendar{
    id: number,
    type: string,
    startDate: string,
    endDate: string,
    status: string,
    requesterName: string
}