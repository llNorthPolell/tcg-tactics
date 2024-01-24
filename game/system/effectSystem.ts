import Unit from "../gameobjects/units/unit";
import Field from "../state/field";
import Effect from "@/game/skillEffects/effect";
import GamePlayer from "../gameobjects/player/gamePlayer";
import { EffectTrigger } from "../enums/keys/effectTriggers";

/**
 * Centralized location to handle effects
 */
export default class EffectSystem{
    private readonly field:Field;

    private readonly units: Map<string,Unit>;

    private passives:Map<number,Effect[]>;

    constructor(field:Field,playersInGame:GamePlayer[]){
        this.field=field;
        this.units=field.units;

        this.passives=new Map();

        playersInGame.forEach(
            player=>{
                this.passives.set(player.id,[]);
            }
        )
    }

    /**
     * Applies the provided effects immediately onto a target unit
     * @param effects 
     * @param target 
     */
    cast(effects:Effect[],target:Unit){
        effects.forEach(
            effect=>{
                switch (effect.trigger){
                    case EffectTrigger.onTurnStart:
                        target.effectHandler.insertToTriggerList(EffectTrigger.onTurnStart,effect);
                        break;
                    default:
                        target.effectHandler.applyInstant(effect);
                        break;
                }

            }
        )
    }
}