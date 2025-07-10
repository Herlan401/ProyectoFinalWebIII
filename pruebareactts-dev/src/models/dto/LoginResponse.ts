import { User } from "../../models/User";
export interface LoginResponse {
    refresh: string;
    access: string;
    usuario: User;
}
