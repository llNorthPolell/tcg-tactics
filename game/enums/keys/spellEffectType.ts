export const SPELL_EFFECT_TYPE = Object.freeze({
    /**
     * Deals damage or heals.
     */
    healthChange: "health-change",   

    /**
     * Change a stat (PWR,DEF,MVT,RNG) on a unit. Recovers on removal.
     */
    statChange: "stat-change",

    /**
     * Summons unit(s) on the field
     */
    summon: "summon",

    /**
     * Player draws cards
     */
    drawCard: "draw-card"
})