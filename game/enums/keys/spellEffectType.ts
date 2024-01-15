export const SPELL_EFFECT_TYPE = Object.freeze({
    /**
     * Deals damage to target instantly, over time, or after specified number of turns
     */
    dealDamage: "deal-damage",   

    /**
     * Heals target instantly, over time, or after specified number of turns
     */
    heal: "heal",   

    /**
     * Change a stat on a unit 
     */
    statChange: "stat-change",

    /**
     * Summons unit(s) on the field
     */
    summon: "summon",

    /**
     * Player draws cards
     */
    drawCard: "draw-card",

    /**
     * Affects an area 
     */
    areaOfEffect: "area-of-effect",

    /**
     * Decides which list of skill effects to apply based on a condition
     */
    conditional: "conditional"
})