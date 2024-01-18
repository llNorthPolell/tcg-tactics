export const EVENTS = {
    /**
     * For card events 
     */
    cardEvent: Object.freeze({
        /**
         * When player selects a card
         * @Params card:Card<CardData>
         * @Params discard?:boolean
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
        CANCEL: "cancel-card-select",

        /**
         * Select card to discard
         * @Params card:Card
         */
        SELECT_DISCARD: "select-discard",

        
        /**
         * When player clicks the OK button on the discard window to confirm discarding a card to make room for the hero card.
         * @Params heroCard:HeroCard
         * @Params discard:Card
         */
        CONFIRM_DISCARD: "confirm-discard"
    }),
    /**
     * Triggers updates for specific UI elements
     */
    uiEvent: Object.freeze({
        /**
         * Signal HUD to update resource display
         * @Params currResource:number
         * @Params maxResource:number
         * @Params incomeRate?:number
         */
        UPDATE_RESOURCE_DISPLAY: "update-resource-display",

        /**
         * Signal HUD to update hand display
         * @Params hand:Card<CardData>[]
         * @Params heroCard:HeroCard
         */
        UPDATE_HAND: "update-hand-ui",

        /**
         * Signal HUD to update unit stats display
         */
        UPDATE_UNIT_STAT_DISPLAY: "update-unit-stat-display",

        /**
         * Signal HUD to update deck count
         */
        UPDATE_DECK_COUNTER: "update-deck-counter",

        /**
         * Signal HUD to update casualty count
         */
        UPDATE_CASUALTY_COUNTER: "update-casualty-counter",

        /**
         * Signal for damage numbers, healing numbers, status ailments etc.
         */
        PLAY_FLOATING_TEXT: "play-floating-text",

        /**
         * Signal to open the discard window. Typically opened when player reaches max hand size
         * and draws a hero card.
         * @Params heroCard:HeroCard
         * @Params discard:Card
         */
        SHOW_DISCARD_WINDOW: "show-discard-window"
    }),
    /**
     * For game events like player turns, game over
     */
    gameEvent: Object.freeze({
        /**
         * When entering a player's turn.
         * @Params activePlayer:GamePlayer
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
         * @Params cardOwner:GamePlayer
         */
        SUMMON_UNIT: "summon-unit",

        /**
         * Signal field manager to apply spell effects (in progress)
         * @Params caster?:  GamePlayer
         * @Params skillEffects: SkillEffect[]
         * @Params target: Unit | Position | undefined
         */
        CAST_SPELL: "cast-spell",

        /**
         * When unit captures a landmark
         * @Params unit:Unit
         * @Params landmark:CapturableLandmark
         */
        CAPTURE_LANDMARK: "capture-landmark",

        /**
         * Signal to apply area of effect
         * @Params effect: AreaOfEffect
         */
        AREA_OF_EFFECT: "area-of-effect"
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
         * @Params destination:Position
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

