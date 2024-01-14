import { CardData } from "../cardData";
import { EffectData } from "../effectData";
import Player from "../player";


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

    readonly passiveSkillDesc?: string;
    readonly passiveSkillData?: EffectData;
    readonly activeSkillDesc?: string;
    readonly activeSkillData?: EffectData;

    readonly cost:number;
    readonly owner:Player;

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
        owner:Player,
        passiveSkillDesc?: string,
        passiveSkillData?: EffectData,
        activeSkillDesc?: string,
        activeSkillData?: EffectData
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
        this.owner=owner;
        this.passiveSkillDesc=passiveSkillDesc;
        this.passiveSkillData = passiveSkillData;
        this.activeSkillDesc=activeSkillDesc;
        this.activeSkillData=activeSkillData;
        this.cost=cost;
    }
    


}