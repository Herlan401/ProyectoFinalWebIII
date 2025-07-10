import { Role } from "./../Role";

export interface UserInfoResponse {
  id: number;
  username: string;
  nombre_completo: string;
  role: Role;
}
