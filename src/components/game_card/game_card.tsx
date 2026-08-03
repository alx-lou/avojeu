import type { Game } from '../../types/game';
import commonStyles from '../../styles/common.module.css';
import styles from './game_card.module.css';

type GameCardProps = {
    game: Game;
}

export function GameCard(
    { game }: GameCardProps
) {
    const tagList = [...game.tags];
    if (game.maxPlayers === undefined || game.maxPlayers < 0) {
        tagList.push(`${game.minPlayers}+ players`);
    } else {
        tagList.push(`${game.minPlayers}-${game.maxPlayers} players`);
    }

    return (
        <div className={styles.card}>
            <img src={game.coverPath} alt={`${game.name} cover`} />
            <div className={styles.gameInfo}>
                <h1 className={commonStyles.title}>
                    {game.name}
                </h1>
                <div className={styles.tag}>
                    {tagList.map((tag) => (
                        <span
                            key={tag}
                            style={{ border: `1px solid ${game.color}` }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <p className={styles.description}>
                    {game.shortDescription}
                </p>
            </div>
        </div>
    );
}