import { Quota } from "@/src/interface/quota";

export interface User {
    id: number;
    email: string;
    quota_id: number;
    quota? : Quota;
    used_bytes: number;
    created_at: string;
    updated_at: string;
}