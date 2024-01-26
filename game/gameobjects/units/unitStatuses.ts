import Unit from "./unit";

export default class UnitStatuses {
    /**
     * Reference to parent
     */
    private readonly unit;

    /**
     * If true, unit is unable to act.
     */
    private stunned:boolean

    /**
     * If true, unit is unable to act. Breaks on damage
     */
    private sleeping:boolean

    /**
     * If true, unit is unable to act. If unit is not a hero, has a chance to shatter and deal additional damage
     */
    private frozen:boolean

    /**
     * If true, unit can attack on the same turn it was summoned
     */
    private rush:boolean

    constructor(unit:Unit){
        this.unit=unit;
        this.frozen=false;
        this.sleeping=false;
        this.stunned=false;
        this.rush=false;
    }

    /**
     * If true, unit is unable to act.
     */
    setStun(stunned:boolean){
        this.stunned=stunned;
    }

    /**
     * If true, unit is unable to act.
     */
    isStunned(){
        return this.stunned;
    }

    /**
     * If true, unit is unable to act. Breaks on damage
     */
    setSleep(sleeping:boolean){
        this.sleeping=sleeping;
    }

    /**
     * If true, unit is unable to act. Breaks on damage
     */
    isSleeping(){
        return this.sleeping;
    }

    /**
     * If true, unit is unable to act. If unit is not a hero, has a chance to shatter and deal additional damage
     */
    setFreeze(frozen:boolean){
        this.frozen=frozen;
    }

    /**
     * If true, unit is unable to act. If unit is not a hero, has a chance to shatter and deal additional damage
     */
    isFrozen(){
        return this.frozen;
    }
    
    /**
     * If true, unit can attack on the same turn it was summoned
     */
    setRush(rush:boolean){
        this.rush=rush;
    }
    
    /**
     * If true, unit can attack on the same turn it was summoned
     */
    isRush(){
        return this.rush;
    }
}