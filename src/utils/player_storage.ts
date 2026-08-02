import type { Player } from "../types/player";

const STORAGE_KEY = "players";

export function getPlayers(): Player[] {
    const strPlayers = localStorage.getItem(STORAGE_KEY);

    if (!strPlayers)  {
        return [];
    }

    try {
        const players = JSON.parse(strPlayers);
        if (!Array.isArray(players)) {
            return [];
        }
        return players as Player[];
    } catch (e) {
        console.error("Error parsing players from localStorage", e);
        return [];
    }
}

export function savePlayers(players: Player[]): void {
    try {
        const strPlayers = JSON.stringify(players);
        localStorage.setItem(STORAGE_KEY, strPlayers);
    } catch (e) {
        console.error("Error saving players to localStorage", e);
    }
}

export function addPlayer(player: Player): void {
    const players = getPlayers();
    players.push(player);
    savePlayers(players);
}

export function updatePlayer(player: Player): boolean {
    const players = getPlayers();
    const index = players.findIndex((p) => p.id === player.id);

    if (index === -1) {
        return false;
    }

    players[index] = player;
    savePlayers(players);
    return true;
}

export function deletePlayer(playerId: string): boolean {
    const players = getPlayers();
    const filteredPlayers = players.filter((p) => p.id !== playerId);

    if (filteredPlayers.length === players.length) {
        return false;
    }

    savePlayers(filteredPlayers);
    return true;
}