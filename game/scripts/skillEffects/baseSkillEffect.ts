import { Position } from "@/game/data/types/position";
import Unit from "@/game/gameobjects/unit";
import SkillEffect from "./skillEffect";

export default abstract class BaseSkillEffect implements SkillEffect{
    readonly name: string;
    readonly duration: number;
    readonly isRemovable: boolean;
    protected target?:Unit|Position;
    protected currTime:number;
    protected active:boolean;

    
    /**
     * Base skill effect class.
     * @param name - Name of the skill effect
     * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
     * @param isRemovable - If true, can be removed by a cleansing effect
     */
    constructor(name:string, duration=0, isRemovable=true){
        this.name = name;

        this.duration=duration;
        this.currTime=0;

        this.isRemovable=isRemovable;

        this.active=false;
    }

    /**
     * Runs apply method if true
     * @returns true if skill effect is still active
     */
    isActive(): boolean {
        return this.active;
    }

    /**
     * 
     * @returns Current tick of this skill; when current time = duration, skill will become inactive
     */
    getCurrTime(): number {
        return this.currTime;
    }

    /**
     * Applies the skill effects onto the target
     */
    abstract apply(): void;

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
    

    setTarget(target: Unit|Position): void {
        this.target=target;
        this.active=true;
    }

    getTarget(): Unit|Position|undefined {
        return this.target;
    }

    reset(): void {
        if(!this.duration || this.duration <= 0) return;
        this.currTime = 0;
    }
    



}