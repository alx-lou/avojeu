import type { ReactNode } from 'react';
import type { Player } from '../../types/player';
import { ProfilePicture } from '../profile_picture/pp';
import styles from './player_card.module.css';

type PlayerCardProps = {
    player: Player;
    showActions?: boolean;
    extraCardContent?: ReactNode;
    onEdit?: (player: Player) => void;
    onDelete?: (playerId: string) => void;
};

export function PlayerCard({
    player,
    extraCardContent
}: PlayerCardProps) {
    return (
        <div className={styles.card}>
            <ProfilePicture player={player} />
            <span className={styles.name}>{player.name}</span>
            <div className={styles.actions}>{extraCardContent}</div>
        </div>
    );
} 
