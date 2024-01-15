import UnitCardData from "./cards/unitCardData";

export default class UnitData {
    /**
     * The name of this unit
     */
    readonly name: string;

    /**
     * The class of this unit (e.g. Soldier, Ranger, Mage etc.)
     */
    readonly unitClass:string;

    readonly baseMaxHp:number;
    readonly baseMaxSp:number;
    readonly basePwr:number;
    readonly baseDef:number;
    readonly baseMvt:number;
    readonly baseRng:number;

    maxHP:number;
    maxSP:number;

    currHp:number;
    currSp:number;
    currPwr:number;
    currDef:number;
    currMvt:number;
    currRng:number;

    /**
     * If true, can be moved on the same turn this unit was summoned
     */
    rush:boolean;

    /**
     * If > 0, unit is not able to act on that turn. 
     */
    stunTime:number;

    /**
     * If > 0, unit is not able to act on that turn. Breaks on damage.
     */
    sleepTime:number;

    constructor(card:UnitCardData){
        this.name = card.name;
        this.unitClass=card.unitClass;
        
        this.baseMaxHp = card.hp;
        this.maxHP=card.hp;
        this.currHp = card.hp;

        this.baseMaxSp = card.sp;
        this.maxSP=card.sp;
        this.currSp = card.sp;

        this.basePwr = card.pwr;
        this.currPwr = card.pwr;
        
        this.baseDef = card.def;
        this.currDef = card.def;

        this.baseMvt = card.mvt;
        this.currMvt = card.mvt;

        this.baseRng = card.rng;
        this.currRng = card.rng;
        
        this.stunTime=0;
        this.sleepTime=0;
        this.rush=card.rush;
    }
    

}