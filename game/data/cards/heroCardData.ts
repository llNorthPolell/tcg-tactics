import { EffectData } from "../effectData";
import UnitCardData from "./unitCardData";


export default class HeroCardData extends UnitCardData{
    readonly leaderSkillDesc: string;
    readonly leaderSkillData: EffectData;
    readonly minions: string[];


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
        leaderSkillDesc: string,
        leaderSkillData: EffectData,
        passiveSkillDesc: string,
        passiveSkillData: EffectData,
        activeSkillDesc: string,
        activeSkillData: EffectData,
        minions: string[],
        cost:number
        ){
            super(
                id,
                name,
                unitClass,
                hp,
                sp,
                pwr,
                def,
                mvt,
                rng,
                cost,
                passiveSkillDesc,
                passiveSkillData,
                activeSkillDesc,
                activeSkillData
            );

        this.leaderSkillDesc=leaderSkillDesc;
        this.leaderSkillData=leaderSkillData;
        this.minions=minions;
        
    }
    


}