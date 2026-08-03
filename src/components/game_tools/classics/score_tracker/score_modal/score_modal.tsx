import { useEffect, useState } from "react";
import { FadeInTransition } from "../../../../transition/transitions";
import { PlayerCard } from "../../../../player_card/player_card";
import { List } from "../../../../list/list";
import type { Player } from "../../../../../types/player";
import type { RoundScores } from "../../../../../types/game_states";
import commonStyles from "../../../../../styles/common.module.css"
import modalStyles from "../../../../../styles/modal.module.css"
import styles from "./score_modal.module.css";

type ScoreModalProps = {
    open: boolean;
    players: Player[];
    onClose: () => void;
    onSave: (roundScore: RoundScores) => void;
};

export function ScoreModal({
    open,
    players,
    onClose,
    onSave,
}: ScoreModalProps) {

    const [scores, setScores] = useState<RoundScores>({});

    useEffect(() => {
        if (!open) return;

        const initialScores = Object.fromEntries(
            players.map(player => [player.id, 0])
        );

        setScores(initialScores);
    }, [open, players]);

    function updateScore(playerId: string, value: string) {
        setScores(prev => ({
            ...prev,
            [playerId]: Number(value),
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSave(scores);
    }

    if (!open) return null;

    return (
        <FadeInTransition>
            <div
                className={modalStyles.modalBackdrop}
                onClick={onClose}
            >
                <form
                    onSubmit={handleSubmit}
                    className={modalStyles.modalBase}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h1 className={modalStyles.modalTitle}>
                        Enter round results
                    </h1>

                    <section className={styles.listContainer}>
                        <List
                            items={players}
                            renderItem={(player) => (
                                <PlayerCard
                                    key={player.id}
                                    player={player}
                                    showActions={false}
                                    extraCardContent={
                                        <input
                                            className={`${commonStyles.textInputField}
                                                        ${styles.scoreInput}`}
                                            type="number"
                                            placeholder="0"
                                            onChange={(e) =>
                                                updateScore(
                                                    player.id,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    }
                                />
                            )}
                        />
                    </section>

                    <section className={styles.actionPanel}>
                        <button
                            type="button"
                            className={`${commonStyles.secondaryButton}
                                        ${styles.action}`}
                            onClick={onClose}>
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={`${commonStyles.secondaryButton}
                                        ${styles.action}`}>
                            Save
                        </button>
                    </section>
                </form>
            </div>
        </FadeInTransition>
    );
}