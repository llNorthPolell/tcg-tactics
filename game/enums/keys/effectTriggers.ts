export const EffectTrigger = Object.freeze({
    // Instant Casts
    /** 
     * Applies Instantly (default value)
    */
    onCast : "onCast",

    /**
     * Applies when effect is removed (either by expiration or by skillEffect)
     */
    onRemove : "onRemove",


    // Turn-Based
    /**
     * Applies at the beginning of each turn
     */
    onTurnStart : "onTurnStart",

    /**
     * Applies at the end of each turn
     */
    onTurnEnd : "onTurnEnd",


    // Combat-Based
    /**
     * Applies when the target attacks
     */
    onAttack : "onAttack",

    /**
     * Applies when the target receives a hit
     */
    onReceiveHit : "onReceiveHit",

    /**
     * Applies when the target kills an enemy
     */
    onKill : "onKill",

    /**
     * Applies when the target is killed
     */
    onDeath : "onDeath"
});