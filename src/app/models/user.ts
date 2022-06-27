export class User {
    activationStatus: number;
    loginStatus: number;
    name: string;
    token: string;
    userID: number;
    userRole: number;
}

export interface Admin {
    password: string,
    userId: number,
    userRoleId: number,
    username: string
}

export const NULL_ADMIN = {
    password: '',
    userId: 0,
    userRoleId: 0,
    username: ''
}
