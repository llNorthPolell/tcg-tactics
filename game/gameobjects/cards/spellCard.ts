import SpellCardData, { SpellEffectData } from "../../data/cards/spellCardData";
import SkillEffect from "../../scripts/skillEffects/skillEffect";
import { Card } from "./card";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { Position } from "@/game/data/types/position";
import DealDamage from "@/game/scripts/skillEffects/dealDamage";
import Player from "@/game/data/player";
import { SPELL_EFFECT_TYPE } from "@/game/enums/keys/spellEffectType";
import Unit from "../unit";
import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import Heal from "@/game/scripts/skillEffects/heal";

export default class SpellCard extends Card<SpellCardData>{
    private skillEffects: SkillEffect[];

    constructor(id:string,data:SpellCardData,owner:Player){
        super(id,data,owner);
        this.skillEffects=[];
        this.parseSkillEffects(data.effectData);
    }
    
    private parseSkillEffects(effectData:SpellEffectData){
        let newEffect;
        switch(effectData.effectType){
            case SPELL_EFFECT_TYPE.dealDamage:
                if (!effectData.amount) break;
                if (!effectData.valueType) break;
                newEffect = new DealDamage(
                    (effectData.name? effectData.name: this.data.name),
                    effectData.amount,
                    effectData.valueType,
                    effectData.duration,
                    effectData.overTime,
                    effectData.isDelayed,
                    effectData.isRemovable
                );
                this.skillEffects = [...this.skillEffects, newEffect];
                break;
            case SPELL_EFFECT_TYPE.heal:
                if (!effectData.amount) break;
                if (!effectData.valueType) break;
                newEffect = new Heal(
                    (effectData.name? effectData.name: this.data.name),
                    effectData.amount,
                    effectData.valueType,
                    effectData.duration,
                    effectData.overTime,
                    effectData.isDelayed,
                    effectData.isRemovable
                );
                this.skillEffects = [...this.skillEffects, newEffect];
                break;
            default:
                break;
        }
    }

    play(target?:Unit | Position){
        switch(this.data.targetType){
            case TARGET_TYPES.ally:
            case TARGET_TYPES.enemy:
                EventEmitter.emit(EVENTS.fieldEvent.CAST_SPELL,this.skillEffects,target as Unit);
                break;
            case TARGET_TYPES.position:
                EventEmitter.emit(EVENTS.fieldEvent.CAST_SPELL,this.skillEffects,target as Position);
                break;
            default:
                EventEmitter.emit(EVENTS.fieldEvent.CAST_SPELL,this.skillEffects);
                break;

        }
        
    }

    render(scene:Phaser.Scene){
        return this.renderGameObject(scene,0x000077,"spells");
    }
}