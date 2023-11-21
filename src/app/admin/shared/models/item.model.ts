import { Coordinates } from './coordinates.model';



export interface Item {
    id?: string;
    name: string;
    imageUrl?: string;
    isMainPage?: boolean;
    coordinates?: Coordinates;
    metersFromVisitor?: number;
}
