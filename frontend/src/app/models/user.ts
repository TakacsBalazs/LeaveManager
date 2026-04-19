export interface UserDto {
    id: string,
    fullname: string,
    email: string,
    roles: string[]
}

export interface CreateUserRequest{
    fullname: string,
    email: string,
    roles: string[],
    password: string
}

export interface UpdateUserRequest{
    fullname: string,
    email: string,
    roles: string[]
}
