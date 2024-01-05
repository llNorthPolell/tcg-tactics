export const TARGET_TYPES = Object.freeze({
    /**
     * Default, user does not need to choose a target to play this card.
     * Instead, user can click the "play spell" button to confirm for cards with this target type. 
     */
    none: "none",   

    /**
     * Spell card can only be applied on an ally unit. 
     */
    ally: "ally",

    /**
     * Spell card can only be applied to an enemy unit.
     */
    enemy: "enemy",

    /**
     * Spell card can be applied to a target position. If a unit is standing on a tile, its attack/support selector will be displayed.
     */
    position: "position"
})