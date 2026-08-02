import { useState } from "react";
import { List } from "../../components/list/list";
import { FadeInTransition } from "../../components/transition/transitions";
import { SessionModal } from "../../components/session_modal/session_modal";
import { useLocation, useNavigate } from "react-router-dom";
import type { Game } from "../../types/game";
import type { GameSession } from "../../types/session";
import homeIcon from "../../assets/icons/home.svg";
import styles from "./game_page.module.css";

type GameLocationState = {
    game?: Game;
};

type GamePageProps = {
    game?: Game;
};

export function GamePage(
    { game }: GamePageProps
) {
    const location = useLocation();
    const activeGame: Game | undefined =
        game ?? (
            location.state && typeof location.state === "object"
                ? (location.state as GameLocationState).game
                : undefined
        );
    const navigate = useNavigate();
    const [sessionModalOpen, setSessionModalOpen] = useState(false);

    const handleSessionSaved = (session: GameSession) => {
        navigate(`/avojeu/session/${session.id}`, { state: { gameSession: session } });
    };

    if (!activeGame) {
        return <div>Game not found</div>;
    }

    const tagList = [...activeGame.tags];
    if (activeGame.maxPlayers === undefined || activeGame.maxPlayers < 0) {
        tagList.push(`${activeGame.minPlayers}+ players`);
    } else {
        tagList.push(`${activeGame.minPlayers}-${activeGame.maxPlayers} players`);
    }

    return (
        <FadeInTransition>
            <header className={styles.header}>

                <div className={styles.cover}>
                    <img src={activeGame.coverPath} alt={activeGame.name} />
                </div>
                <div className={styles.gameInfo}>
                    <h1>{activeGame.name}</h1>
                    <div className={styles.tagList}>
                        <List
                            items={tagList}
                            renderItem={(tag) => (
                                <p className={styles.tagPill} 
                                   key={tag}
                                   style={{ borderColor: activeGame.color }}>
                                    {tag}
                                </p>
                            )}
                            orientation="horizontal"
                        />
                    </div>
                </div>
            </header>

            <section className={styles.actionPanel}>
                <button
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <img src={homeIcon} alt="Home" />
                </button>
                <button 
                    disabled={activeGame.tools.length === 0}
                    onClick={() => setSessionModalOpen(true)}
                >
                    Start new game
                </button>
            </section>

            <section className={styles.gameDescription}>
                <h1>Description</h1>
                <p>{activeGame.description}</p>
            </section>

            {sessionModalOpen && (
                <SessionModal 
                    open={sessionModalOpen}
                    game={activeGame}
                    onClose={() => setSessionModalOpen(false)}
                    onSaved={handleSessionSaved}
                />
            )}
        </FadeInTransition>
    )
}