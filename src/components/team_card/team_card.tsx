import type { Player } from "../../types/player"
import { PlayerCard } from "../player_card/player_card"

import commonStyles from "../../styles/common.module.css"
import styles from "./team_card.module.css"


type TeamCardProps = {
    teamName: string
    players : Player[]
}

export function TeamCard({teamName, players}: TeamCardProps) {
    return (
        <details open className={styles.teamCard}>
            <summary className={commonStyles.text}>
                {teamName}
            </summary>

            <div className={styles.teamComposition}>
                {players.map((player) => (
                    <PlayerCard
                    key={player.id} // or another unique key
                    player={player}
                    showActions={false}
                    />
                ))}
            </div>
        </details>
    )
}
