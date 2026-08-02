import { useEffect, useMemo, useState } from "react";
import { getPlayers } from "../../utils/player_storage";
import { saveActiveSession } from "../../utils/session_storage";
import { FadeInTransition } from "../transition/transitions";
import { PlayerCard } from "../player_card/player_card";
import type { Game } from "../../types/game";
import {List} from "../../components/list/list"
import type { GameSession } from "../../types/session";
import styles from "./session_modal.module.css";

const STORAGE_KEY = "session-modal-selection";

type SessionModalProps = {
    open: boolean;
    game: Game;
    onClose: () => void;
    onSaved?: (session: GameSession) => void;
}

function getPersistedSelection(): string[] {
    if (typeof window === "undefined") return [];

    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
        return [];
    }

    try {
        const parsedValue = JSON.parse(storedValue);
        return Array.isArray(parsedValue)
            ? parsedValue.filter((value): value is string => typeof value === "string")
            : [];
    } catch {
        return [];
    }
}

export function SessionModal(
    {open, game, onClose, onSaved}: SessionModalProps 
) {
    const availablePlayers = useMemo(() => getPlayers(), []);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>(() => getPersistedSelection());

    useEffect(() => {
        setSelectedPlayers(getPersistedSelection());
    }, [open]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPlayers));
        }
    }, [selectedPlayers]);

    const playerCount = selectedPlayers.length;
    const isValidSelection = useMemo(() => {
        return playerCount >= game.minPlayers && 
               (game.maxPlayers === undefined || playerCount <= game.maxPlayers);
    }, [playerCount, game.minPlayers, game.maxPlayers]);

    const handlePlayerToggle = (playerId: string) => {
        setSelectedPlayers((prev) =>
            prev.includes(playerId)
                ? prev.filter((id) => id !== playerId)
                : [...prev, playerId]
        );
    };

    const isPlayerSelected = (playerId: string) => selectedPlayers.includes(playerId);

    const handleStartSession = () => {
        if (!isValidSelection) return;

        const selectedPlayerObjects = availablePlayers.filter((p) => 
            selectedPlayers.includes(p.id)
        );

        const initSession: GameSession = {
            id: `session_${Date.now()}`,
            game,
            players: selectedPlayerObjects,
            timestamp: new Date().toISOString(),
            gameState: {
                scores: {},
                teams: {}
            },
            finished: false
        };

        saveActiveSession(initSession);
        window.localStorage.removeItem(STORAGE_KEY);
        setSelectedPlayers([]);
        onSaved?.(initSession);
        onClose();
    };

    const playerRangeText = game.maxPlayers === undefined || game.maxPlayers < 0
        ? `${game.minPlayers}+ players`
        : `${game.minPlayers}-${game.maxPlayers} players`;

    if (!open) return null;

    return (
        <FadeInTransition>
             <div className={styles.modalBackdrop} onClick={onClose}>
                 <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <section className={styles.header}>
                        <h1>Who will join the game?</h1>
                        <p>Select {playerRangeText} : {playerCount} selected</p>
                    </section>

                    <section className={styles.listContainer}>
                        <List
                            items={availablePlayers}
                            renderItem={(player) => {
                                const selected = isPlayerSelected(player.id);

                                return (
                                    <label
                                        key={player.id}
                                        className={`${styles.playerItem} ${selected ? styles.selected : ''}`}
                                        style={
                                            selected
                                                ? {
                                                    backgroundColor: player.color,
                                                }
                                                : undefined
                                        }
                                    >
                                        <input
                                            className={styles.checkbox}
                                            type="checkbox"
                                            checked={selected}
                                            onChange={() => handlePlayerToggle(player.id)}
                                            aria-label={`Select ${player.name}`}
                                        />

                                        <PlayerCard player={player} showActions={false}/>
                                    </label>
                                );
                            }}
                        />
                    </section>

                    <div className={styles.actionPanel}>
                        <button className={styles.action} onClick={onClose}>
                            Cancel
                        </button>

                        <button className={styles.action} onClick={handleStartSession} disabled={!isValidSelection}>
                            Start Session
                        </button>
                    </div>
                </div>
             </div>
        </FadeInTransition>
    )
}