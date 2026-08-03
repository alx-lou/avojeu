import { useEffect, useState } from "react";
import type { Teams } from "../../../types/game_states";
import type { GameSession } from "../../../types/session";
import { FadeInTransition } from "../../transition/transitions";
import { TeamCard } from "../../team_card/team_card";
import { shufflePlayers } from "../../../utils/classical_tools";
import { buildCodenameTeams } from "../../../utils/codename";
import { saveActiveSession } from "../../../utils/session_storage";
import commonStyles from "../../../styles/common.module.css";
import styles from "./team_sorter.module.css";

type TeamGeneratorProps = {
    gameSession: GameSession;
}

export function CodenameTeamGenerator({ gameSession }: TeamGeneratorProps) {
    const [teams, setTeams] = useState<Teams>(() => {
        const existingTeams = gameSession.gameState.teams;
        return Object.keys(existingTeams ?? {}).length > 0
            ? existingTeams
            : buildCodenameTeams(shufflePlayers(gameSession.players));
    });

    const generateTeams = () => {
        const newTeams = buildCodenameTeams(shufflePlayers(gameSession.players));
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
                <button
                    className={`${commonStyles.primaryButton} ${styles.generationButton}`}
                    onClick={generateTeams}>
                    Generate
                </button>
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