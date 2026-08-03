import { List } from "../../components/list/list";
import { VersionFooter } from "../../components/version_footer/version_footer";
import { GameCard } from "../../components/game_card/game_card";
import { SessionCard } from "../../components/session_card/session_card";
import { Link } from "react-router-dom"
import { FadeInTransition } from "../../components/transition/transitions";
import styles from "./home_page.module.css";
import playerIcon from "../../assets/icons/user.svg";
import { routePaths, ROUTES } from "../../routes/routes";
import { GAMES_LIST } from "../../game_registry";
import { getActiveSession } from "../../utils/session_storage";

export function HomePage(){
    const activeSession = getActiveSession();

    return (
        <FadeInTransition>
        <div className={styles.page}>

            <header className={styles.header}>
                <p className={styles.title}>
                    What are we <span style={{ color: "var(--color-primary)" }}>playing</span>  today ?
                </p>
                <Link to={ROUTES.PLAYERS} className={styles.playerButton}>
                        <img src={playerIcon} alt="Player" />
                        Players
                </Link>
            </header>

            <main className={styles.main}>
                {activeSession && (
                    <details open>
                        <summary className={styles.sectionTitle}>
                            Resume
                        </summary>
                        <section className={styles.activeSession}>
                            <Link to={routePaths.session(activeSession.id)}
                                  state={{ gameSession: activeSession }} 
                                  className={styles.cardLink}>
                                <SessionCard gameSession={activeSession}/>
                            </Link>
                        </section>
                    </details>
                )}

                <section className={styles.gameList}>
                    <p className={styles.sectionTitle}>Games</p>
                    <div className={styles.listContainer}>
                        <List
                            items={GAMES_LIST}
                            renderItem={(game) => (
                                <Link to={routePaths.game(game.id)}
                                      state={{ game }}
                                      key={game.id}
                                      className={styles.cardLink}>
                                    <GameCard
                                        game={game}
                                        />
                                </Link>
                            )}
                            />
                    </div>
                </section>
            </main>

            <VersionFooter/>
        </div>
        </FadeInTransition>
    );
}

