import { EVENTS } from "@/game/enums/keys/events";
import { EventEmitter } from "../events";
import CreateEffect from "./createEffect";
import SkillEffect from "./skillEffect";
import Unit from "@/game/gameobjects/unit";
import GamePlayer from "@/game/gameobjects/gamePlayer";
import { Position } from "@/game/data/types/position";
import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";

export default class AreaOfEffect extends CreateEffect{
    caster?:Unit|GamePlayer;
    readonly targetType:string;
    
    constructor(name:string,effectsToApply:SkillEffect[], splashRange:number, duration:number=0, targetType:string = TARGET_TYPES.enemy, isRemovable:boolean=false){
        super(name,effectsToApply, duration, splashRange, isRemovable);
        this.targetType=targetType;
    }
   
    apply(): void {
        if (!this.target) return;
        EventEmitter.emit(
            EVENTS.fieldEvent.AREA_OF_EFFECT,
            this
        );
    }



    clone() : CreateEffect{
        return new AreaOfEffect(this.name,this.effectsToApply,this.range,this.duration,this.targetType,this.isRemovable);
    }
}