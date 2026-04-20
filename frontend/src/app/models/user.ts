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

export interface UserDropdown{
    id: string,
    fullname: string
}

export interface FilterUsersRequest{
    fullname: string | null,
    email: string | null,
    roles: string[] | null
}

export interface Role{
    id: string
    name: string
}