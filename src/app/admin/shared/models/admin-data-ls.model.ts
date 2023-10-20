import { AdminState } from "../../store/admin.reducer";

export interface AdminDataLS {
    adminState: AdminState
    expirationTimeStamp: number
}
