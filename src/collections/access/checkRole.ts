import { User } from "@/payload-types";

export const checkRole = (role: string | null, user: User | null ): boolean =>{
    return Boolean(role === user?.role);
}