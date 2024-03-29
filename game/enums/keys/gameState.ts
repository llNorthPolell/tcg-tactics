/**
 * Contains keys to game state registered in the game registry 
 */
export const GAME_STATE = Object.freeze({

    // Game Data
    /**
     * Contains a list of players who are playing this game
     * @returns playersInGame:GamePlayer[]
     */
    playersInGame: "players-in-game",

    /**
     * Contains low level data on the map (Phaser Tilemap and its layers, see game/data/types/tilemapData.ts)
     * @returns tilemapData:TilemapData
     */
    tilemapData: "tilemap-data",

    /**
     * Contains 2-D array of selection tiles for selecting positions on the field to play a card or move a unit to
     * @returns selectionGrid:SelectionTileController[][]
     */
    selectionGrid: "selection-grid",

    /**
     * Contains maps of landmarks by type and by location (see game/data/types/landmarkCollection.ts)
     * @returns landmarksData: LandmarkCollection
     */
    landmarksData: "landmarks-data",

    // State
    state: "game-state",

    field: "field",

    
})

