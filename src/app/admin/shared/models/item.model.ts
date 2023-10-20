export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Item {
    id?: string;
    name: string;
    imageUrl?: string;
    isMainPage?: boolean;
    coordinates?: Coordinates;
    metersFromVisitor?: number;
}
