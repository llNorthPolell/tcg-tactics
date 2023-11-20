import UnitCardData from "./unitCardData";


export default class HeroCardData extends UnitCardData{
    readonly leaderSkill: string;
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
        leaderSkill: string,
        passiveSkill: string,
        activeSkill: string,
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
                cost,
                passiveSkill,
                activeSkill
            );

        this.leaderSkill=leaderSkill;
        this.minions=minions;
        
    }
    


}