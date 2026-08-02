import type { Game } from "./game";
import type { Player } from "./player";
import type { GameState } from "./game_states";

export type GameSession = {
    id: string;
    game: Game;
    players: Player[];
    timestamp: string;
    gameState: GameState;
    finished: boolean;
};
