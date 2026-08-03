import { List } from "../../components/list/list";
import { PlayerCard } from "../../components/player_card/player_card";
import { PlayerEditMenu } from "../../components/player_edit_menu/player_edit_menu";
import { PlayerFormModal } from "../../components/player_modal/player_modal";
import { FadeInTransition } from "../../components/transition/transitions";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import styles from "./players_page.module.css";
import gameIcon from "../../assets/icons/game.svg";
import type { Player } from "../../types/player";
import { deletePlayer, getPlayers } from "../../utils/player_storage";

export function PlayersPage() {
    const [players, setPlayers] = useState<Player[]>(() => getPlayers());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const refreshPlayers = () => {
        setPlayers(getPlayers());
    };

    const handleDeletePlayer = (playerId: string) => {
        deletePlayer(playerId);
        refreshPlayers();
    };

    const handleOpenCreateModal = () => {
        setSelectedPlayer(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (player: Player) => {
        setSelectedPlayer(player);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlayer(null);
    };

    return (
        <FadeInTransition>
            <div className={styles.page}>

                <header className={styles.header}>
                    <Link to={ROUTES.HOME} className={styles.gameButton}>
                        <img src={gameIcon} alt="Game" />
                        Games
                    </Link>

                    <p className={styles.title}>
                        Who will be <span style={{ color: "var(--color-primary)" }}>playing</span>  today ?
                    </p>
                </header>

                <main className={styles.main}>

                    <section className={styles.mainTitle}>
                        <p>Registered players</p>
                        <button onClick={handleOpenCreateModal}>+</button>
                    </section>

                    <section className={styles.listContainer}>
                        <List
                            items={players}
                            renderItem={(player) => (
                                <PlayerCard
                                    key={player.id}
                                    player={player}
                                    extraCardContent={
                                        <PlayerEditMenu
                                            player={player}
                                            onEdit={handleOpenEditModal}
                                            onDelete={handleDeletePlayer}
                                        />
                                    }
                                />
                            )}
                        />
                    </section>

                    <section>
                        <PlayerFormModal
                            open={isModalOpen}
                            player={selectedPlayer}
                            onClose={handleCloseModal}
                            onSaved={refreshPlayers}
                        />
                    </section>
                </main>
            </div>
        </FadeInTransition>
    );
}
