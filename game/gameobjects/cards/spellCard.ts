import SpellCardData from "../../data/cards/spellCardData";
import SkillEffect from "../../scripts/skillEffects/skillEffect";
import { Card } from "./card";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { Position } from "@/game/data/types/position";
import Unit from "../unit";
import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import SkillEffectFactory from "@/game/scripts/skillEffectFactory";
import SpellCardGO from "./spellCardGO";

export default class SpellCard extends Card<SpellCardData>{
    private skillEffects: SkillEffect[];

    constructor(id:string,data:SpellCardData){
        super(id,data);
        this.skillEffects=SkillEffectFactory.getSkillEffect(this.data.name,data.effectData);
    }

    play(target?:Unit | Position){
        switch(this.data.targetType){
            case TARGET_TYPES.ally:
            case TARGET_TYPES.enemy:
                EventEmitter.emit(EVENTS.fieldEvent.CAST_SPELL,this.owner,this.skillEffects,target as Unit);
                break;
            case TARGET_TYPES.position:
                if (!target) break;
                const targetLocation = (target instanceof Unit)? target.getLocation():target;
                EventEmitter.emit(EVENTS.fieldEvent.CAST_SPELL,this.owner,this.skillEffects,targetLocation);
                break;
            default:
                EventEmitter.emit(EVENTS.fieldEvent.CAST_SPELL,this.owner,this.skillEffects,undefined);
                break;

        }
        
    }

    render(scene : Phaser.Scene) : SpellCardGO{
        if (!this.gameObject) 
            this.gameObject=new SpellCardGO(scene,this);

        return this.gameObject;
    }

}