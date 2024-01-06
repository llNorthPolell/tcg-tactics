export const EVENTS = {
    /**
     * For card events 
     */
    cardEvent: Object.freeze({
        /**
         * When player selects a card
         * @Params card : Card<CardData>
         */
        SELECT: "select-card",

        /**
         * When player has selected a card and clicks on the field
         * @Params location : Position
         */        
        PLAY: "play-card",

        /**
         * When player clicks cancel button after selecting a card
         */
        CANCEL: "cancel-card-select"
    }),
    /**
     * Triggers updates for specific UI elements
     */
    uiEvent: Object.freeze({
        /**
         * Signal HUD to update resource display
         * @Params unit:Unit
         */
        UPDATE_RESOURCE_DISPLAY: "update-resource-display",

        /**
         * Signal HUD to update hand display
         * @Params hand:Card<CardData>[]
         */
        UPDATE_HAND: "update-hand-ui",

        /**
         * Signal HUD to update unit stats display
         */
        UPDATE_UNIT_STAT_DISPLAY: "update-unit-stat-display"
    }),
    /**
     * For game events like player turns, game over
     */
    gameEvent: Object.freeze({
        /**
         * When entering a player's turn.
         * @Params playerNumber:number
         * @Params index:number
         * @Params isDevicePlayerTurn:boolean
         */
        PLAYER_TURN: "player-turn",
        
        /**
         * Signals turn manager to go to next player's turn.
         */
        NEXT_TURN:"next-turn",
    }),
    /**
     * For player-specific events, like generating resources
     */
    playerEvent: Object.freeze({
        /**
         * Signal card manager to generate resources for the player
         * @Params income:number
         */
        GENERATE_RESOURCES: "generate-resources",
    }),
    /**
     * For events happening on the playing field, such as summoning a unit, casting a spell, capturing landmarks
     */
    fieldEvent: Object.freeze({
        /**
         * Signal field manager to create a unit at the specified location on the field and assign it to the specified player
         * @Params location:Position
         * @Params unitData:UnitCardData
         * @Params cardOwner:Player
         */
        SUMMON_UNIT: "summon-unit",

        /**
         * Signal field manager to apply spell effects (in progress)
         * @Params skillEffects: SkillEffect[]
         * @Params target: Unit | Position | undefined
         */
        CAST_SPELL: "cast-spell",

        /**
         * When unit captures a landmark
         * @Params unit:Unit
         * @Params landmark:CapturableLandmark
         */
        CAPTURE_LANDMARK: "capture-landmark"
    }),
    /**
     * For unit-specific events, like moving a unit, attacking another unit, unit waiting
     */
    unitEvent: Object.freeze({
        /**
         * When player clicks on a unit on the field
         * @Params unit:Unit
         */
        SELECT: "select-unit",

        /**
         * When player clicks the cancel button after selecting a unit
         */
        CANCEL: "cancel-unit-select",

        /**
         * When player clicks on an attack selector after selecting a unit and possibly moving it
         * @Params attacker:Unit
         * @Params defender:Unit
         */
        ATTACK: "attack-unit",

        /**
         * When player clicks on a selection tile after selecting a unit
         * @Params unit:Unit
         * @Params targetPosition:Position
         */
        MOVE: "move-unit",

        /**
         * When player clicks on wait button to confirm unit move
         */
        WAIT: "wait-unit",

        /**
         * When a unit is killed
         * @Params unit:Unit
         */
        DEATH: "unit-death"
    })
}

