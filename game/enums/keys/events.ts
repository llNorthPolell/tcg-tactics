export const EVENTS = {
    cardEvent: Object.freeze({
        SELECT: "select-card",
        DESELECT: "deselect-card",
        PLAY: "play-card",
        CANCEL: "cancel"
    }),
    uiEvent: Object.freeze({
        
    }),
    gameEvent: Object.freeze({
        PLAYER_TURN: "player-turn",
        NEXT_TURN:"next-turn"
    }),
    fieldEvent: Object.freeze({
        SUMMON_UNIT: "summon-unit",
        CAST_SPELL: "cast-spell"
    })
}

