import type { RoundScores } from "../types/game_states";

export type PlayerHand = Record<string, string[]>
export type FlipVersion = "FLIP7" | "FLIP7_REVENGE"

export const FLIP7_CARDS = [
    { id: "1", color: "#C0B4A1" },
    { id: "2", color: "#D7E218" },
    { id: "3", color: "#DB0040" },
    { id: "4", color: "#56C5DD" },
    { id: "5", color: "#3BB94B" },
    { id: "6", color: "#B154AE" },
    { id: "7", color: "#DB7365" },
    { id: "8", color: "#A2E561" },
    { id: "9", color: "#FF8F08" },
    { id: "10", color: "#F40006" },
    { id: "11", color: "#7CA5D0" },
    { id: "12", color: "#A2828B" },
    { id: "+2", color: "#FEAC25" },
    { id: "+4", color: "#FEAC25" },
    { id: "+6", color: "#FEAC25" },
    { id: "+8", color: "#FEAC25" },
    { id: "+10", color: "#FEAC25" },
    { id: "x2", color: "#FEAC25" }
]

export const FLIP7_REVENGE_CARDS = [
    { id: "1", color: "#C0B4A1" },
    { id: "2", color: "#D7E218" },
    { id: "3", color: "#DB0040" },
    { id: "4", color: "#56C5DD" },
    { id: "5", color: "#3BB94B" },
    { id: "6", color: "#B154AE" },
    { id: "7", color: "#DB7365" },
    { id: "8", color: "#A2E561" },
    { id: "9", color: "#FF8F08" },
    { id: "10", color: "#F40006" },
    { id: "11", color: "#7CA5D0" },
    { id: "12", color: "#A2828B" },
    { id: "13", color: "#0F8CCE" },
    { id: "-2", color: "#EE6352" },
    { id: "-4", color: "#EE6352" },
    { id: "-6", color: "#EE6352" },
    { id: "-8", color: "#EE6352" },
    { id: "-10", color: "#EE6352" },
    { id: "%2", color: "#EE6352" },
    { id: "U7", color: "#EBEBEB" },
    { id: "L13", color: "#EBEBEB" }
]

export function getFlipCardDeck(flipVersion: FlipVersion) {
    return flipVersion === "FLIP7" ? FLIP7_CARDS : FLIP7_REVENGE_CARDS;
}

export function createInitialHands(playerIds: string[]): PlayerHand {
    return Object.fromEntries(
        playerIds.map(id => [id, []])
    );
}

export function createInitialScores(playerIds: string[]): RoundScores {
    return Object.fromEntries(
        playerIds.map(id => [id, 0])
    );
}

export function computeScoreFromHands(playerCards: string[]): number {
const getBaseValue = (card: string) =>
        card === "U7" ? 7 :
        card === "L13" ? 13 :
        Number(card);
    const base = playerCards
        .filter(c => !["x2", "%2", "+2", "+4", "+6", "+8", "+10", "-2", "-4", "-6", "-8", "-10"].includes(c))
        .reduce((sum, c) => sum + getBaseValue(c), 0);
    const factor = playerCards.includes("x2")
        ? 2
        : playerCards.includes("%2")
            ? 0.5
            : 1;
    const bonus = playerCards
        .filter(c => /^[+-]\d+$/.test(c))
        .reduce((sum, c) => sum + Number(c), 0);
    return Math.floor(base * factor + bonus);
}