import { useEffect, useState } from "react";
import { createInitialHands,
         computeScoreFromHands,
         createInitialScores,
         getFlipCardDeck, 
         type PlayerHand,
         type FlipVersion} from "../../../../utils/flip";
import { FadeInTransition } from "../../../transition/transitions";
import type { Player } from "../../../../types/player";
import type { RoundScores } from "../../../../types/game_states";

import commonStyles from "../../../../styles/common.module.css"
import modalStyles from "../../../../styles/modal.module.css"
import styles from "./score_modal.module.css"

type FlipScoreModalProps = {
    open: boolean;
    flipVersion: FlipVersion;
    players: Player[];
    onClose(): void;
    onSave(roundScore: RoundScores): void;
}

export function FlipScoreModal(
    { open, flipVersion, players, onClose, onSave }: FlipScoreModalProps
) {
    const CARDS = getFlipCardDeck(flipVersion); 

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hands, setHands] = useState<PlayerHand>({});
    const [roundScores, setRoundScores] = useState<RoundScores>({});
    const [manualScores, setManualScores] = useState<RoundScores>({});
    const [inputValue, setInputValue] = useState("");

    const player = players[currentIndex];
    const cards = hands[player?.id] ?? [];
    const manualScore = manualScores[player.id];
    const score = manualScore ?? computeScoreFromHands(cards);

    useEffect(() => {
        if (!open) return;
        setHands(createInitialHands(players.map(p => p.id)));
        setCurrentIndex(0);
        setRoundScores(createInitialScores(players.map(p => p.id)));
        setManualScores({});
        setInputValue("");
    }, [open, players]);

    useEffect(() => {
        setInputValue(score.toString());
    }, [player.id, score]);

    function validatePlayer() {
        const updatedScores = {
            ...roundScores,
            [player.id]: score
        };
        if (currentIndex === players.length - 1) {
            onSave(updatedScores);
            onClose();
            return;
        }
        setRoundScores(updatedScores);
        setCurrentIndex(index => index + 1);
    }

    function updateScore(value: number) {
        setInputValue(value.toString());
        setHands(previous => ({
            ...previous,
            [player.id]: [],
        }));
        setManualScores(previous => ({
            ...previous,
            [player.id]: value,
        }));
    }

    function clearManualScore() {
        setManualScores((previous) => {
            const next = { ...previous };
            delete next[player.id];
            return next;
        });

        // Show computed score immediately
        const playerCards = hands[player.id] ?? [];
        setInputValue(computeScoreFromHands(playerCards).toString());
    }

    function toggleCard(card: string) {
        clearManualScore()
        setHands(previous => {
            const playerCards = previous[player.id] ?? [];
            const updatedCards =
                playerCards.includes(card)
                    ? playerCards.filter(c => c !== card)
                    : [...playerCards, card];
            return {
                ...previous,
                [player.id]: updatedCards
            };
        });
    }


    if (!open) return null;

    return (
        <FadeInTransition>
            <div className={modalStyles.modalBackdrop} onClick={onClose}>
                <div
                    className={modalStyles.modalBase}
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className={styles.scoreEditor}>
                        <h1 className={commonStyles.title}>
                            {player.name}
                        </h1>
                        <div className={styles.scorePanel}>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="0"
                                value={inputValue}
                                className={commonStyles.textInputField}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (!/^\d*$/.test(value)) {return;}
                                    if (value === "") {
                                        clearManualScore();
                                        return;
                                    }
                                    updateScore(Number(value));
                                }}
                            />
                            <button 
                                className={`${commonStyles.primaryButton} 
                                            ${styles.saveButton}`}
                                onClick={validatePlayer}>
                                Ok
                            </button>
                        </div>

                        <details open>
                            <summary className={commonStyles.subtitle}>
                                Cards selection
                            </summary>
                            <section className={styles.cardPanel}>
                                {CARDS.map(card => {
                                    const selected = cards.includes(card.id);
                                    return (
                                        <button
                                            key={card.id}
                                            style={{"--card-color": card.color} as React.CSSProperties}
                                            className={`${commonStyles.secondaryButton} 
                                                        ${styles.cardButton}
                                                        ${selected ? styles.selected : ''}`}
                                            onClick={() => toggleCard(card.id)}>
                                            {card.id}
                                        </button>
                                    )
                                })}
                            </section>
                        </details>
                    </div>

                </div>
            </div>
        </FadeInTransition>
    );
}