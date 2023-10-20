import { Timestamp } from "@angular/fire/firestore";

export interface VisitData {
    venueId: string;
    itemId: string;
    itemName: string;
    language: string;
    timestamp: number;
}
