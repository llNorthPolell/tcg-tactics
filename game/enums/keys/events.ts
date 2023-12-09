export const EVENTS = {
    cardEvent: Object.freeze({
        SELECT: "select-card",
        PLAY: "play-card",
        CANCEL: "cancel-card-select"
    }),
    uiEvent: Object.freeze({
        SELECT_LOCATION: "select-location",
        WAKE_UI: "wake",
        UPDATE_RESOURCE_DISPLAY: "update-resource-display",
        UPDATE_HAND: "update-hand-ui",
        SHOW_CANCEL_CARD: "show-cancel-card-btn",
        HIDE_CANCEL_CARD: "hide-cancel-card-btn"
    }),
    gameEvent: Object.freeze({
        PLAYER_TURN: "player-turn",
        NEXT_TURN:"next-turn",
        END_TURN: "end-turn"
    }),
    fieldEvent: Object.freeze({
        GENERATE_RESOURCES: "generate-resources",
        SUMMON_UNIT: "summon-unit",
        CAST_SPELL: "cast-spell"
    }),
    unitEvent: Object.freeze({
        CHECK_STANDING_ON_RALLY: "check-standing-on-rally",
        SELECT: "select-unit",
        CANCEL: "cancel-unit-select"
    })
}

