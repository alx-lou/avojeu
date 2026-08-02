import { useEffect, useState } from "react";
import type { Teams } from "../../../../types/game_states";
import type { GameSession } from "../../../../types/session";
import { FadeInTransition } from "../../../transition/transitions";
import { TeamCard } from "../../../team_card/team_card";
import {
  buildTeams,
  clampTeamCount,
  getMaxTeamCount,
  getMinTeamCount,
  shufflePlayers,
} from "../../../../utils/classical_tools";
import styles from "./team_sorter.module.css";
import { saveActiveSession } from "../../../../utils/session_storage";

type TeamGeneratorProps = {
  gameSession: GameSession;
}

export function TeamGenerator({ gameSession }: TeamGeneratorProps) {
    const playerCount = gameSession.players.length;
    const [teamCount, setTeamCount] = useState<number>(
        playerCount === 0 ? 0 : getMinTeamCount(playerCount)
    );
    const [teams, setTeams] = useState<Teams>(() => {
        const existingTeams = gameSession.gameState.teams;
        return Object.keys(existingTeams ?? {}).length > 0
            ? existingTeams
            : buildTeams(shufflePlayers(gameSession.players), teamCount);
    });

    const minCount = getMinTeamCount(playerCount);
    const maxCount = getMaxTeamCount(playerCount);

    const decreaseTeams = () => {
        setTeamCount((current: number) => clampTeamCount(current - 1, playerCount));
    };

    const increaseTeams = () => {
        setTeamCount((current: number) => clampTeamCount(current + 1, playerCount));
    };

    const generateTeams = () => {
        const newTeams = buildTeams(shufflePlayers(gameSession.players), teamCount);
        setTeams(newTeams);
        gameSession.gameState.teams = newTeams;
        saveActiveSession(gameSession);
    };

    useEffect(() => {
        gameSession.gameState.teams = teams
        saveActiveSession(gameSession)
    })

    return (
        <FadeInTransition>
            <div className={styles.teamGenerator}>
                <section className={styles.teamCount}>
                    <h1>Number of teams</h1>
                    <div className={styles.counter}>
                        <button onClick={decreaseTeams} disabled={teamCount <= minCount}>
                            -
                        </button>
                        <p>{teamCount} team{teamCount > 1 ? "s" : ""}</p>
                        <button onClick={increaseTeams} disabled={teamCount >= maxCount}>
                            +
                        </button>
                    </div>
                    <button
                        className={styles.generationButton}
                        onClick={generateTeams}
                        disabled={playerCount === 0}
                    >
                        Generate
                    </button>
                </section>
                <section>
                    {Object.keys(teams).length === 0 ? (
                        <p>No players available to sort</p>
                    ) : (
                        Object.entries(teams).map(([teamName, playerIds]) => {
                            const players = playerIds
                                .map((playerId) => gameSession.players.find((player) => player.id === playerId))
                                .filter((player) => player !== undefined);

                            return (
                                <TeamCard
                                    key={teamName}
                                    teamName={teamName}
                                    players={players}
                                />
                            );
                        })
                    )}
                </section>
            </div>
        </FadeInTransition>
    );
}