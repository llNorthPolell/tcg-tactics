import { Card } from "./card";


export default class HeroCard implements Card{
    readonly id: string;
    readonly name: string;
    
    readonly unitClass: string;

    readonly hp: number;
    readonly sp: number;
    readonly pwr: number;
    readonly def: number;
    readonly mvt: number;

    readonly leaderSkill: string;
    readonly passiveSkill: string;
    readonly activeSkill: string;
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
        minions: string[]
        ){
        this.id=id;
        this.name=name;
        this.unitClass=unitClass;
        this.hp = hp;
        this.sp=sp;
        this.pwr=pwr;
        this.def=def;
        this.mvt=mvt;
        this.leaderSkill=leaderSkill;
        this.passiveSkill=passiveSkill;
        this.activeSkill=activeSkill;
        this.minions=minions;
    }
    
}