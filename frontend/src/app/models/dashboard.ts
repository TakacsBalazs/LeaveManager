import { LeaveBalanceDto } from "./leave-balance";

export interface DashboardDto {
    balances: LeaveBalanceDto[];
    profilePictureUrl?: string
}
