export interface HolidayResponse {
    id: number,
    name: string,
    date: string
}

export interface CreateHolidayRequest {
    name: string,
    date: string
}