import { lazy, type ComponentType } from "react";
import type { GameSession } from "./types/session";

type GameToolProps = {
    gameSession: GameSession;
};

type ToolComponent = ComponentType<GameToolProps>;

type ToolEntry = {
    toolLabel: string;
    toolComponent: ToolComponent;
    preload: () => Promise<void>;
};

function createToolEntry(
    toolLabel: string,
    importer: () => Promise<{ default: ToolComponent }>
): ToolEntry {
    const LazyComponent = lazy(importer);
    return {
        toolLabel,
        toolComponent: LazyComponent,
        preload: async () => {
            await importer();
        },
    };
}

export const gameToolRegistry: Record<string, ToolEntry> = {
    // Classical tools
    dice_roller: createToolEntry("Dice", () => import("./components/game_tools/classics/dice_roller/dice_roller").then(({ DiceRoller }) => ({ default: DiceRoller }))),
    team_sorter: createToolEntry("Teams", () => import("./components/game_tools/classics/team_sorter/team_sorter").then(({ TeamGenerator }) => ({ default: TeamGenerator }))),
    timer: createToolEntry("Timer", () => import("./components/game_tools/classics/timer/timer").then(({ Timer }) => ({ default: Timer }))),
    score_tracker: createToolEntry("Scores", () => import("./components/game_tools/classics/score_tracker/leaderboard/score_tracker").then(({ ScoreTracker }) => ({ default: ScoreTracker }))),
    graph: createToolEntry("Graphs", () => import("./components/game_tools/classics/line_chart/line_chart").then(({ LineChartCard }) => ({ default: LineChartCard }))),
    // Codename
    codename_team_sorter: createToolEntry("Teams", () => import("./components/game_tools/codename/team_sorter").then(({ CodenameTeamGenerator }) => ({ default: CodenameTeamGenerator }))),
    // Flip7
    flip7_score_tracker: createToolEntry("Score", () => import("./components/game_tools/flip7/leaderboard/score_tracker").then(({ FlipScoreTracker }) => ({ default: FlipScoreTracker }))),
};