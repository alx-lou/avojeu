import type { Player } from "../types/player";
import type { Teams } from "../types/game_states";

const BLUE_TEAM = "Blue team";
const RED_TEAM = "Red team";

function buildCodenameTeams(players: Player[]): Teams {

    const teams: Teams = {
        [BLUE_TEAM]: [],
        [RED_TEAM]: []
    };

    players.forEach((player, index) => {
        const teamName = index % 2 === 0 ? BLUE_TEAM : RED_TEAM;
        teams[teamName].push(player.id);
    });

    return teams;
}

export { buildCodenameTeams }