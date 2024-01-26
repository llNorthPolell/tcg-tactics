import Unit from "../gameobjects/units/unit";
import Field from "../state/field";
import Effect from "@/game/skillEffects/effect";
import GamePlayer from "../gameobjects/player/gamePlayer";
import { EffectTrigger } from "../enums/keys/effectTriggers";
import { Position } from "../data/types/position";
import { getUnitsInRange } from "../scripts/util";
import { TARGET_TYPES } from "../enums/keys/targetTypes";
import { SPELL_EFFECT_TYPE } from "../enums/keys/spellEffectType";
import { EffectData } from "../data/types/effectData";
import EffectFactory from "../skillEffects/effectFactory";

/**
 * Centralized location to handle effects
 */
export default class EffectSystem {
    private readonly field: Field;

    private passives: Map<number, Effect[]>;

    constructor(field: Field, playersInGame: GamePlayer[]) {
        this.field = field;
        this.passives = new Map();

        playersInGame.forEach(
            player => {
                this.passives.set(player.id, []);
            }
        )
    }


    cast(sourcePlayer:GamePlayer, effects: Effect[], target: Unit | Position){
        effects.forEach(
            effect=>{
                if (effect.targetType!==TARGET_TYPES.position && !(target instanceof Unit))
                    throw new Error("Attempted to cast an effect meant for units on a location...")


                else if (effect.targetType === TARGET_TYPES.position){
                    if (target instanceof Unit)
                        this.castPosition(sourcePlayer, effect, target.position()!.get());
                    else
                        this.castPosition(sourcePlayer, effect, target as Position);
                }

                this.castSingleUnit(sourcePlayer,effect,target as Unit);
            }
        )
    }

    /**
     * Applies the provided effect onto a target unit. If the effect trigger is "onCast", will be applied immediately.
     * Otherwise, the effect will be stored in the appropriate list to be applied when the trigger is met.
     * @param effect
     * @param target 
     */
    castSingleUnit(sourcePlayer: GamePlayer, effect: Effect, target: Unit) {
        if (effect.targetType === TARGET_TYPES.ally && target.getOwner()?.getTeam() !== sourcePlayer.getTeam())
            return;
        if (effect.targetType === TARGET_TYPES.enemy && target.getOwner()?.getTeam() === sourcePlayer.getTeam())
            return;


        const targetUnit = target as Unit;
        switch (effect.trigger) {
            case EffectTrigger.onTurnStart:
                targetUnit.effectHandler.insertToTriggerList(EffectTrigger.onTurnStart, effect);
                break;
            default:
                targetUnit.effectHandler.applyInstant(effect);
                break;
        }
    }

    /**
     * Applies the provided effect onto a target position
     */
    castPosition(sourcePlayer: GamePlayer, effect:Effect, target: Position) {
        const unitsAffected = getUnitsInRange(this.field, target,effect.range);
        console.log(unitsAffected);
        unitsAffected.forEach(
            unit => {
                const subEffects = effect.createSubEffect();
                this.cast(sourcePlayer,subEffects,unit);
            }
        )
    }

    /**
     * Forcefully ends an effect
     */
    forceRemove(effect: Effect) {
        effect.forceRemove();
    }
}