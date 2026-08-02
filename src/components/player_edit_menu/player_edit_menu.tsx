import type { Player } from "../../types/player";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import styles from "./player_edit_menu.module.css";

type PlayerEditMenuProps = {
  player: Player;
  onEdit?: (player: Player) => void;
  onDelete?: (playerId: string) => void;
};

export function PlayerEditMenu({ player, onEdit, onDelete }: PlayerEditMenuProps) {
  return (
    <div className={styles.menu}>
      <button
        className={styles.button}
        aria-label="Edit"
        onClick={() => onEdit?.(player)}
      >
        <img src={editIcon} alt="Edit" />
      </button>
      <button
        className={styles.button}
        aria-label="Delete"
        onClick={() => onDelete?.(player.id)}
      >
        <img src={deleteIcon} alt="Delete" />
      </button>
    </div>
  );
}
