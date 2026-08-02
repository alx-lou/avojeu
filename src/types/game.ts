export type Game = {
    id: string;
    name: string;
    shortDescription: string;
    description: string;
    tags: string[];
    minPlayers: number;
    maxPlayers?: number;
    coverPath: string;
    color: string;
    tools: string[];
};
