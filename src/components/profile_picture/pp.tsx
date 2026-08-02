import type { Player } from "../../types/player";
import styles from './pp.module.css';


type ProfilePictureProps = {
    player: Player
};

export function ProfilePicture(
    { player }: ProfilePictureProps
){
    return (
        <div 
            className={styles.profilePicture}
            style={{
                "--player-color": player.color,
            } as React.CSSProperties}>
            <span className={styles.avatar}>{player.avatar}</span>
        </div>
    );
}