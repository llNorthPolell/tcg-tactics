/**
 * Contains keys to game registry 
 */
export const GAME_STATE = Object.freeze({
    /**
     * Contains information about device player
     * @returns devicePlayer:GamePlayer
     */
    player: "player",

    /**
     * Contains information about opponents in a match
     * @returns opponents:GamePlayer[]
     */
    opponents: "opponents",

    /**
     * Contains information about allies in a match
     * @returns allies:GamePlayer[]
     */
    allies: "allies",

    /**
     * Contains information about the playing field (tilemaps)
     * @returns field:Field - Field type = { mapData: TilemapData, units: Map<string,Unit>, landmarks: Map<string, Landmark>}
     */
    field: "field"

})

