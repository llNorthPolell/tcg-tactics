import { EffectData } from "../effectData";
import Player from "../player";
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
        cost:number,
        owner:Player,
        rush?:boolean
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
                owner,
                passiveSkillDesc,
                passiveSkillData,
                activeSkillDesc,
                activeSkillData,
                rush
            );

        this.leaderSkillDesc=leaderSkillDesc;
        this.leaderSkillData=leaderSkillData;
        this.minions=minions;
        
    }
    


}