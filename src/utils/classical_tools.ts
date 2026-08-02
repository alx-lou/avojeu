import type { Player } from "../types/player";
import type { GameState, Teams } from "../types/game_states";

export interface GraphPoint {
    label: string;
    value: number;
}

export interface GraphSeries {
    id: string;
    name: string;
    color?: string;
    data: GraphPoint[];
}

// Team sorter
// ==========================================================

function getMinTeamCount(playerCount: number) {
    return playerCount >= 2 ? 2 : 1;
}

function getMaxTeamCount(playerCount: number) {
    return Math.max(1, playerCount);
}

function clampTeamCount(teamCount: number, playerCount: number) {
    if (playerCount === 0) {
        return 0;
    }

    const minCount = getMinTeamCount(playerCount);
    const maxCount = getMaxTeamCount(playerCount);
    return Math.min(Math.max(teamCount, minCount), maxCount);
}

function shufflePlayers(players: Player[]) {
    const shuffled = [...players];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function buildTeams(players: Player[], teamCount: number): Teams {
    if (players.length === 0 || teamCount === 0) {
        return {} as Teams;
    }

    const actualTeamCount = clampTeamCount(teamCount, players.length);
    const teams: Teams = {};

    Array.from({ length: actualTeamCount }, (_, index) => {
        teams[`Team ${index + 1}`] = [];
    });

    players.forEach((player, index) => {
        const teamName = `Team ${(index % actualTeamCount) + 1}`;
        teams[teamName].push(player.id);
    });

    return teams;
}

export { getMinTeamCount, getMaxTeamCount, clampTeamCount, shufflePlayers, buildTeams };

// Score tracker + graph
// ==========================================================

function getPlayerScore(playerId: string, gameState: GameState): number {
    const scores = gameState.scores[playerId] ?? [];
    return scores.reduce((total, score) => total + score, 0);
}

function getRoundHistory(gameState: GameState): number {
    const rounds = Object.values(gameState.scores).map((scores) => scores.length);
    return rounds.length > 0 ? Math.max(...rounds) : 0;
}

function buildScoreChartSeries(players: Player[], gameState: GameState): GraphSeries[] {
    return players.map((player) => {
        const scores = gameState.scores[player.id] ?? [];

        let cumulative = 0;

        return {
            id: player.id,
            name: player.name,
            color: player.color,
            data: scores.map((score, index) => {
                cumulative += score;

                return {
                    label: `Round ${index + 1}`,
                    value: cumulative,
                };
            }),
        };
    });
}


export { getPlayerScore, getRoundHistory, buildScoreChartSeries };