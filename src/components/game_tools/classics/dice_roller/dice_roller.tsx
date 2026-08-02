import { FadeInTransition } from "../../../transition/transitions"
import { useState } from "react";
import styles from "./dice_roller.module.css"

import diceIcon from "../../../../assets/icons/dice.svg"

const DICE = [4, 6, 8, 10, 12, 20];

export function DiceRoller() {
    const [rolling, setRolling] = useState(false);
    const [selectedSides, setSelectedSides] = useState(6);
    const [result, setResult] = useState<number | null>(null);

    function rollDice(sides: number) {
        if (rolling) return;

        setRolling(true);
        setResult(null);

        // Simulate the animation duration
        setTimeout(() => {
            setResult(Math.floor(Math.random() * sides) + 1);
            setRolling(false);
        }, 700);
    }

    return (
        <FadeInTransition>
        <div className={styles.diceRoller}>
            <section>
                <p>Dice selector</p>
                <div className={styles.diceSelector}>
                    {DICE.map((sides) => (
                        <button
                            key={sides}
                            type="button"
                            className={selectedSides === sides ? styles.selected : ""}
                            onClick={() => setSelectedSides(sides)}
                        >
                            D{sides}
                        </button>
                    ))}
                </div>
            </section>

            <section className={styles.resultArea}>
                <p className={styles.result}>
                    {result}
                    {rolling && (
                            <img
                                src={diceIcon}
                                className={styles.dice}
                                alt="Rolling dice"
                            />
                    )}
                </p>
                <button type="button" onClick={() => rollDice(selectedSides)}>
                    Roll
                </button>
            </section>
        </div>
        </FadeInTransition>
    );
}