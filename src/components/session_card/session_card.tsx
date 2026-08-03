import { ProfilePicture } from '../profile_picture/pp';
import type { GameSession } from '../../types/session';
import commonStyles from '../../styles/common.module.css';
import styles from './session_card.module.css';

type GameCardProps = {
    gameSession: GameSession;
}

export function SessionCard(
    { gameSession }: GameCardProps
) {
    return (
        <div className={styles.card}>
            <img src={gameSession.game.coverPath} alt={`${gameSession.game.name} cover`} />
            <div className={styles.gameInfo}>
                <h1 className={commonStyles.title}>
                    {gameSession.game.name}
                </h1>
                <div className={styles.avatarStack}>
                    {gameSession.players.map((player) => (
                        <ProfilePicture player={player} key={player.id}/>
                    ))}
                </div>
            </div>
        </div>
    )
}