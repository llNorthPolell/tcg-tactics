import SkillEffect from "./skillEffect";
import { Position } from "@/game/data/types/position";
import Unit from "@/game/gameobjects/unit";

export default class CreateEffect implements SkillEffect{
    readonly name;
    private target?: Unit | Position;
    effectsToInflict:SkillEffect[];
    readonly duration:number;
    readonly isRemovable: boolean;
    private currTime:number;
    private active:boolean;
    readonly spreadRange:number;

/**
 * This effect will create other effects globally or around a target (i.e. auras, diseases)
 * @param name - Name of the skill effect
 * @param friendlyEffects - List of effects to give surrounding allies
 * @param enemyEffects - List of effects to inflict enemies
 * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
 * @param spreadRange - Range of spread. Set to -1 if intended to be global.
 * @param sequential - If true, will apply effects in order one after another.
 * @param isRemovable - If true, can be removed by a cleansing effect
 */
    constructor(name:string,effectsToInflict:SkillEffect[],duration:number,spreadRange:number,isRemovable=true){
        this.name = name;
        this.effectsToInflict = effectsToInflict;

        this.duration=duration;
        this.currTime=0;
            
        this.isRemovable=isRemovable;
        this.spreadRange=spreadRange;

        this.active=true;
    }


    setTarget(target: Unit): void {
        this.target=target;
        this.active=true;
    }

    getTarget(): Unit| Position | undefined {
        return this.target;
    }

    reset(): void {
        if(!this.duration || this.duration <= 0) return;
        this.currTime = 0;
    }
    

    getCurrTime(){
        return this.currTime;
    }


    isActive(){
        return this.active;
    }


    apply(): void {
        if (!this.active) return;

    }

    remove():void{
        if (!this.isRemovable){
            console.log("This spell effect cannot be removed.");
            return;
        }
        this.forceRemove();
    }


    forceRemove():void{
        this.active=false;
        console.log("This spell effect has been removed.");
    }
    
}