import { VisitorState } from "src/app/visitor/store/visitor.reducer";
import { AdminState } from "../../store/admin.reducer";
import { UiState } from "../ui.reducer";
import { AuthState } from "src/app/auth/store/auth.reducer";

export interface StoreData {
    admin: AdminState;
    ui: UiState;
    visitor: VisitorState;
    auth: AuthState
}
