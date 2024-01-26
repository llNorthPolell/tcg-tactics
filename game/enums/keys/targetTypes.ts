export const TARGET_TYPES = Object.freeze({
    /**
     * Default, user does not need to choose a target to play this card.
     * Instead, user can click the "play spell" button to confirm for cards with this target type. 
     */
    none: "none",   

    /**
     * Spell effects can only be applied on an ally unit. 
     */
    ally: "ally",

    /**
     * Spell effects can only be applied to an enemy unit.
     */
    enemy: "enemy",

    /**
     * Spell effects can be applied to both ally and enemy units.
     */
    unit: "unit",
    
    /**
     * Spell card can be applied to a target position.
     */
    position: "position",

    
    /**
     * Spell card can be applied to both units and positions (both selection tiles and spell selectors will be displayed).
     */
    all: "all",

    /**
     * For units only
     */
    rallyPoint: "rally"
})