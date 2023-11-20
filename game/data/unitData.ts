import UnitCardData from "./cards/unitCardData";

export default class UnitData {
    readonly unitClass:string;

    readonly baseMaxHp:number;
    readonly baseMaxSp:number;
    readonly basePwr:number;
    readonly baseDef:number;
    readonly baseMvt:number;

    maxHP:number;
    maxSP:number;

    currHp:number;
    currSp:number;
    currPwr:number;
    currDef:number;
    currMvt:number;

    isStunned:boolean;
    sleepTime:number;

    constructor(card:UnitCardData){
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

        this.isStunned=false;
        this.sleepTime=0;
    }
    

}