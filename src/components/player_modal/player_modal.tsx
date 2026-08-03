import { PlayerCard } from "../player_card/player_card";
import { addPlayer, updatePlayer } from "../../utils/player_storage";
import { useEffect, useState } from "react";
import { FadeInTransition } from "../transition/transitions";
import type { Player } from "../../types/player";
import modalStyles from "../../styles/modal.module.css";
import commonStyles from "../../styles/common.module.css";
import styles from "./player_modal.module.css";

type PlayerFormModalProps = {
    open: boolean;
    player: Player | null;
    onClose: () => void;
    onSaved?: () => void;
};

const COLORS = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#a855f7",
];

const AVATARS = [
    "🐱",
    "🐶",
    "🐼",
    "🦊",
    "🐸",
    "🦇",
    "🤖",
    "🦄",
];

export function PlayerFormModal(
    {open, player, onClose, onSaved}: PlayerFormModalProps
) {
    
    const [name, setName] = useState("");
    const [color, setColor] = useState(COLORS[0]);
    const [avatar, setAvatar] = useState(AVATARS[0]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];

        setName(player?.name ?? "");
        setColor(player?.color ?? randomColor);
        setAvatar(player?.avatar ?? randomAvatar);
    }, [open, player]);

    const handleSave = () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        const playerToSave: Player = {
            id: player?.id ?? Date.now().toString(),
            name: trimmedName,
            color,
            avatar,
        };

        if (player?.id) {
            updatePlayer(playerToSave);
        } else {
            addPlayer(playerToSave);
        }
        setName("");
        setColor(COLORS[0]);
        setAvatar(AVATARS[0]);
        onSaved?.();
        onClose();
    };
    
    if (!open) return null;

    return (
        <FadeInTransition>
            <div className={modalStyles.modalBackdrop} onClick={onClose}>
                <div
                    className={modalStyles.modalBase}
                    onClick={(e) => e.stopPropagation()}
                >

                    <h1 className={modalStyles.modalTitle}>
                        {player ? "Edit Player" : "Create Player"}
                    </h1>

                    <PlayerCard 
                        player={{
                            id: "preview",
                            name,
                            color,
                            avatar,
                        }}
                    />

                    <h2 className={commonStyles.subTitle}>
                        Name
                    </h2>
                    
                    <input
                        className={`${commonStyles.textInputField} 
                                    ${styles.nameInput}`}
                        type="text"
                        placeholder="Player name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <h2 className={commonStyles.subTitle}>
                        Color
                    </h2>

                    <div className={styles.colorSelector}>
                        {COLORS.map((c) => (
                            <button
                                key={c}
                                className={
                                    color === c
                                        ? `${styles.colorOption} ${styles.selected}`
                                        : styles.colorOption
                                }
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>

                    <h2 className={commonStyles.subTitle}>
                        Avatar
                    </h2>


                    <div className={styles.avatarSelector}>
                        {AVATARS.map((a) => (
                            <button
                                key={a}
                                className={`${commonStyles.flexCenter}}
                                            ${avatar === a
                                                ? `${styles.avatarOption} ${styles.selected}`
                                                : styles.avatarOption
                                            }`}
                                onClick={() => setAvatar(a)}
                            >
                                {a}
                            </button>
                        ))}
                    </div>

                    <div className={styles.actionPanel}>
                        <button className={commonStyles.primaryButton} onClick={onClose}>
                            Cancel
                        </button>

                        <button className={commonStyles.primaryButton} onClick={handleSave}>
                            Save
                        </button>
                    </div>

                </div>
            </div>
        </FadeInTransition>
    );
}