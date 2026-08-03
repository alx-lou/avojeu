import { useState } from "react"
import type { GameSession } from "../../../../../types/session"
import { FadeInTransition } from "../../../../transition/transitions"
import { PlayerCard } from "../../../../player_card/player_card"
import { List } from "../../../../list/list"
import { ScoreModal } from "../score_modal/score_modal"
import { saveActiveSession } from "../../../../../utils/session_storage"
import type { GameState, RoundScores } from "../../../../../types/game_states"
import commonStyles from "../../../../../styles/common.module.css"
import styles from "./score_tracker.module.css"

type PlayerScoreProps = {
    playerScore: number
}

function PlayerScore ({playerScore} : PlayerScoreProps) {
    return (
        <div className={styles.scoreDisplay}>
            {playerScore} pts
        </div>
    )
}



type ScoreTrackerProps = {
    gameSession: GameSession
}

export function ScoreTracker(
    { gameSession }: ScoreTrackerProps
) {
    const [scoreModalOpen, setScoreModalOpen] = useState(false);

    const getPlayerScore = (playerId: string, gameState: GameState) => {
      const scores = gameState.scores[playerId] ?? [];
      return scores.reduce((total, score) => total + score, 0);
    }

    const applyRoundScore = (roundScores: RoundScores) => {
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
                        onClick={() => setScoreModalOpen(true)}>
                        + Start round
                    </button>
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
                <ScoreModal
                    open={scoreModalOpen}
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