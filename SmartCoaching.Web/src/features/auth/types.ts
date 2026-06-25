export interface LoginRequest {
    email: string;
    password: string;
    role?: 'coach' | 'athlete';
}

export interface LoginResponse {
    token: string;
}
