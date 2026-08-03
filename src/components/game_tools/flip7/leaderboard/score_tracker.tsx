import { useState } from "react"
import type { GameSession } from "../../../../types/session"
import { FadeInTransition } from "../../../transition/transitions"
import { PlayerCard } from "../../../player_card/player_card"
import { List } from "../../../list/list"
import { FlipScoreModal } from "../score_modal/score_modal"
import { saveActiveSession } from "../../../../utils/session_storage"
import type { GameState } from "../../../../types/game_states"
import commonStyles from "../../../../styles/common.module.css"
import styles from "./score_tracker.module.css"

type PlayerScoreProps = {
    playerScore: number
}

function PlayerScore ({playerScore} : PlayerScoreProps) {
    return (
        <div className={`${commonStyles.flexCenter} ${styles.scoreDisplay}`}>
            {playerScore} pts
        </div>
    )
}



type FlipScoreTrackerProps = {
    gameSession: GameSession
}

export function FlipScoreTracker(
    { gameSession }: FlipScoreTrackerProps
) {
    const FLIP_VERSION = gameSession.game.id === "flip7" ? "FLIP7" : "FLIP7_REVENGE";
    const [scoreModalOpen, setScoreModalOpen] = useState(false);

    const getPlayerScore = (playerId: string, gameState: GameState) => {
      const scores = gameState.scores[playerId] ?? [];
      return scores.reduce((total, score) => total + score, 0);
    }

    const applyRoundScore = (roundScores: Record<string, number>) => {
        const updatedScores = {
            ...gameSession.gameState.scores,
        }
        for (const player of gameSession.players) {
            const playerId = player.id;
            const scoreVariation = roundScores[playerId] ?? 0;

            gameSession.gameState.scores[playerId] = [
                ...(updatedScores[playerId] ?? []),
                scoreVariation,
            ];
        }
        return {
            ...gameSession,
            gameState: {
                ...gameSession.gameState,
                scores: updatedScores,
            },
        };
    };


    return(
        <FadeInTransition>
            <div className={styles.scoreTracker}>
                <section className={styles.actions}>
                    <button 
                        className={`${commonStyles.secondaryButton}
                                    ${styles.newRoundButton}`}
                        onClick={() => setScoreModalOpen(true)}>+ Start round</button>
                </section>
                <section className={styles.leaderboard}>
                    <List 
                        items={gameSession.players}
                        renderItem={(player) => {
                            const playerScore = getPlayerScore(player.id, gameSession.gameState);

                            return (
                                <PlayerCard
                                    key={player.id}
                                    player={player}
                                    extraCardContent={<PlayerScore playerScore={playerScore} />}
                                />
                            );
                        }}/>
                </section>
                <FlipScoreModal
                    open={scoreModalOpen}
                    flipVersion={FLIP_VERSION}
                    players={gameSession.players}
                    onClose={() => setScoreModalOpen(false)}
                    onSave={(roundScores) => {
                        applyRoundScore(roundScores);
                        saveActiveSession(gameSession);
                        setScoreModalOpen(false)
                    }}
                />
            </div>
        </FadeInTransition>
    )
}