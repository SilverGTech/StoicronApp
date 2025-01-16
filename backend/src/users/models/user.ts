
export interface User {
    id: number;
    name: string;
    username: string;
    birthdate: Date;
    email: string;
    alternative_email?: string;
    password: string;
    active: boolean;
    country: string;
    created_at: Date;
    updated_at: Date;
}