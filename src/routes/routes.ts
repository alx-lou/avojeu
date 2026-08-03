export const ROUTES = {
    HOME: "/",
    PLAYERS: "/players",
    GAME: "/game/:id",
    SESSION: "/session/:id",
    ERROR: "/error",
} as const


export const routePaths = {
    game: (id: string) => `/game/${id}`,
    session: (id: string) => `/session/${id}`,
}