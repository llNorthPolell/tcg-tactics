import { CardData } from "../cardData";


export default class UnitCardData implements CardData{
    readonly id: string;
    readonly name: string;
    
    readonly unitClass: string;

    readonly hp: number;
    readonly sp: number;
    readonly pwr: number;
    readonly def: number;
    readonly mvt: number;
    readonly rng: number;

    readonly passiveSkill?: string;
    readonly activeSkill?: string;

    readonly cost:number;

    constructor(
        id : string, 
        name : string, 
        unitClass: string,
        hp:number,
        sp:number,
        pwr:number,
        def:number,
        mvt:number,
        rng:number,
        cost:number,
        passiveSkill?: string,
        activeSkill?: string
        ){
        this.id=id;
        this.name=name;
        this.unitClass=unitClass;
        this.hp = hp;
        this.sp=sp;
        this.pwr=pwr;
        this.def=def;
        this.mvt=mvt;
        this.rng=rng;
        this.passiveSkill=passiveSkill;
        this.activeSkill=activeSkill;
        this.cost=cost;
    }
    


}