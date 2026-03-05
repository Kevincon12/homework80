export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Place {
    id: string;
    name: string;
    description?: string;
}

export interface Item {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
    placeId: string;
    image: string | null;
    createdAt: string;
}