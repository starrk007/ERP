export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    ok: boolean;
    accessToken: string;
    refreshToken: string;
}